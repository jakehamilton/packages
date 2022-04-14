const kleur = require("kleur");
const log = require("../../util/log");
const cmd = require("../../util/cmd");
const npm = require("../../util/npm");
const git = require("../../util/git");
const task = require("../../util/task");
const help = require("./help");
const getArgs = require("./args");

const command = async () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    if (args._.length < 2) {
        log.error("No script specified.");
        help();
        process.exit(1);
    }

    if (args._.length > 2) {
        log.error("Only one script can be run at a time.");
        help();
        process.exit(1);
    }

    const name = args._[1];

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

    const pkgs = npm.getAllPackages();

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

    let failed = false;

    await task.execute(
        matchingPkgs,
        { ordered: args["--ordered"], cache: args["--cache"] },
        (pkg, options, color, signal) =>
            new Promise(async (resolve, reject) => {
                if (!pkg.config.scripts || !pkg.config.scripts[name]) {
                    log.debug(
                        `No script "${name}" found in package "${pkg.config.name}".`
                    );
                    return;
                }

                let command = `npm run ${name}`;

                if (args["--"].length > 0) {
                    command += `-- ${args["--"].join(" ")}`;
                }

                const proc = cmd.spawnAsync(
                    command.split(" ")[0],
                    command.split(" ").slice(1),
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
                                      (process.stdout.isTTY ? "1" : "0"),
                        },
                    }
                );

                log.info(
                    `${color().bold(
                        `${pkg.config.name} executing "${command}" in "${pkg.path}".`
                    )}`
                );

                signal.addEventListener("abort", () => {
                    proc.kill("SIGKILL");

                    failed = true;
                });

                proc.stdout.on("data", (data) => {
                    for (const line of data.toString().split("\n")) {
                        if (line.trim() !== "") {
                            log.info(
                                `${color(`${pkg.config.name} >`)} ${line}`
                            );
                        }
                    }
                });

                proc.stderr.on("data", (data) => {
                    for (const line of data.toString().split("\n")) {
                        if (line.trim() !== "") {
                            log.warn(
                                `${color(`${pkg.config.name} >`)} ${line}`
                            );
                        }
                    }
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
            })
    );

    if (failed) {
        process.exit(1);
    }
};

module.exports = command;
