const kleur = require("kleur");
const log = require("../../util/log");
const npm = require("../../util/npm");
const git = require("../../util/git");
const cmd = require("../../util/cmd");
const task = require("../../util/task");
const help = require("./help");
const getArgs = require("./args");

const command = async () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    const pkgs = npm.getAllPackages();

    const cycles = npm.detectCycles(pkgs);

    if (cycles.length > 0) {
        log.error("Cyclic dependencies detected. Fix these to continue:");
        log.error("");

        for (const cycle of cycles) {
            log.error(
                `Cycle: ${cycle.map((name) => `"${name}"`).join(" -> ")}`
            );
        }

        process.exit(1);
    }

    const changed = [];

    if (args["--changed"]) {
        for (const { pkg } of git.getChangedPackages()) {
            changed.push(pkg.config.name);
        }
    }

    const tagged = [];

    if (args["--tagged"]) {
        const tags = git.tag.at();

        for (const tag of tags) {
            const { name } = npm.parseNameWithVersion(tag);

            tagged.push(name);
        }
    }

    const scope = args["--scope"] || ".+";

    log.debug(`Creating matcher for scope "${scope}".`);
    const scopeRegex = new RegExp(scope);

    const matchingPkgs = [...pkgs.values()].filter((pkg) => {
        if (args["--changed"] && !changed.includes(pkg.config.name)) {
            return false;
        }

        if (args["--tagged"] && !tagged.includes(pkg.config.name)) {
            return false;
        }

        return pkg.config.name.match(scopeRegex);
    });

    if (matchingPkgs.length === 0) {
        log.info("No matching packages.");
        process.exit(0);
    }

    const locals = matchingPkgs.reduce((locals, pkg) => {
        const transitiveLocals = npm.getLocalDependencies(pkg, pkgs, true);

        for (const [name, transitivePkg] of [
            ...transitiveLocals.entries(),
        ].reverse()) {
            if (!locals.has(name)) {
                locals.set(name, {
                    pkg: transitivePkg,
                    transitive: true,
                });
            }
        }

        locals.set(pkg.config.name, {
            pkg,
            transitive: false,
        });

        return locals;
    }, new Map());

    log.info("Installing packages.");
    const localPkgs = [...locals.values()].map(({ pkg }) => pkg);

    if (args["--with-deps"]) {
        const downstream = npm.getDownstreamPackages(localPkgs);

        localPkgs.push(...downstream.values());
    }

    const map = npm.pkgsToDependencyMap(localPkgs);

    let failed = false;

    await npm.withLinkedLocals(pkgs, async () => {
        await task.executeOrdered(
            map,
            { ordered: true, cache: false },
            (pkg, options, color, signal) =>
                new Promise(async (resolve, reject) => {
                    try {
                        log.info(
                            `${color().bold(
                                `${pkg.config.name} installing dependencies.`
                            )}`
                        );

                        const proc = cmd.spawnAsync(
                            "npm",
                            args["--no-save"]
                                ? ["install", "--no-save"]
                                : ["install"],
                            {
                                cwd: pkg.path,
                                encoding: "utf8",
                                stdio: "pipe",
                                env: {
                                    ...process.env,
                                    FORCE_COLOR:
                                        process.env.LOG_ICONS === "true"
                                            ? "1"
                                            : process.env.FORCE_COLOR ||
                                              (process.stdout.isTTY
                                                  ? "1"
                                                  : "0"),
                                },
                            }
                        );

                        proc.stdout.on("data", (data) => {
                            for (const line of data.toString().split("\n")) {
                                if (line.trim() !== "") {
                                    log.info(
                                        `${color(
                                            `${pkg.config.name} >`
                                        )} ${line}`
                                    );
                                }
                            }
                        });

                        proc.stderr.on("data", (data) => {
                            for (const line of data.toString().split("\n")) {
                                if (line.trim() !== "") {
                                    log.warn(
                                        `${color(
                                            `${pkg.config.name} >`
                                        )} ${line}`
                                    );
                                }
                            }
                        });

                        signal.addEventListener("abort", () => {
                            proc.kill("SIGKILL");

                            failed = true;
                        });

                        proc.on("close", (code) => {
                            proc.stdin.end();

                            if (code === null) {
                                log.fatal(
                                    `${color(
                                        `${pkg.config.name} killed due to another task failing.`
                                    )}`
                                );

                                failed = true;

                                return reject(
                                    `${pkg.config.name} killed due to another task failing.`
                                );
                            } else if (code !== 0) {
                                log.fatal(
                                    `${color(
                                        `${
                                            pkg.config.name
                                        } command exited with code "${kleur
                                            .white()
                                            .bold(code)}".`
                                    )}`
                                );

                                failed = true;

                                return reject(
                                    `${pkg.config.name} command exited with code "${code}".`
                                );
                            }

                            resolve();
                        });
                    } catch (error) {
                        reject(
                            `Error installing dependencies for package "${pkg.config.name}".`
                        );
                    }
                })
        );
    });

    if (failed) {
        process.exit(1);
    }
};

module.exports = command;
