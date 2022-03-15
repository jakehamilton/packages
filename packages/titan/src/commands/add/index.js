const semver = require("semver");
const log = require("../../util/log");
const npm = require("../../util/npm");
const git = require("../../util/git");
const cmd = require("../../util/cmd");
const help = require("./help");
const getArgs = require("./args");

const command = async () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    const deps = args._.slice(1);

    if (deps.length === 0) {
        log.error("You must specify a package to install.");
        help();
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

    log.info("Updating package configuration.");
    for (const pkg of matchingPkgs) {
        for (const dep of deps) {
            const { name, version } = npm.parseNameWithVersion(dep);

            if (pkgs.has(name)) {
                if (
                    version === "latest" ||
                    semver.satisfies(pkgs.get(name).config.version, version)
                ) {
                    const localVersion =
                        version === "latest"
                            ? `^${pkgs.get(name).config.version}`
                            : version;

                    if (
                        !args["--dev"] &&
                        !args["--peer"] &&
                        !args["--optional"]
                    ) {
                        if (!pkg.config.hasOwnProperty("dependencies")) {
                            pkg.config.dependencies = {};
                        }

                        pkg.config.dependencies[name] = localVersion;
                    }

                    if (args["--dev"]) {
                        if (!pkg.config.hasOwnProperty("devDependencies")) {
                            pkg.config.devDependencies = {};
                        }

                        pkg.config.devDependencies[name] = localVersion;
                    }

                    if (args["--peer"]) {
                        if (!pkg.config.hasOwnProperty("peerDependencies")) {
                            pkg.config.peerDependencies = {};
                        }

                        pkg.config.peerDependencies[name] = localVersion;
                    }

                    if (args["--optional"]) {
                        if (
                            !pkg.config.hasOwnProperty("optionalDependencies")
                        ) {
                            pkg.config.optionalDependencies = {};
                        }

                        pkg.config.optionalDependencies[name] = localVersion;
                    }
                } else {
                    log.debug(
                        `Local package "${name}" with version "${version}" could not be used in "${pkg.config.name}".`
                    );

                    if (
                        !args["--dev"] &&
                        !args["--peer"] &&
                        !args["--optional"]
                    ) {
                        if (!pkg.config.hasOwnProperty("dependencies")) {
                            pkg.config.dependencies = {};
                        }

                        pkg.config.dependencies[name] = version;
                    }

                    if (args["--dev"]) {
                        if (!pkg.config.hasOwnProperty("devDependencies")) {
                            pkg.config.devDependencies = {};
                        }

                        pkg.config.devDependencies[name] = version;
                    }

                    if (args["--peer"]) {
                        if (!pkg.config.hasOwnProperty("peerDependencies")) {
                            pkg.config.peerDependencies = {};
                        }

                        pkg.config.peerDependencies[name] = version;
                    }

                    if (args["--optional"]) {
                        if (
                            !pkg.config.hasOwnProperty("optionalDependencies")
                        ) {
                            pkg.config.optionalDependencies = {};
                        }

                        pkg.config.optionalDependencies[name] = version;
                    }
                }
            } else {
                let resolvedVersion = version;

                if (version === "latest") {
                    try {
                        const version = JSON.parse(
                            cmd.exec(`npm view ${name} version --json`, {
                                encoding: "utf8",
                            })
                        );

                        if (!version) {
                            log.warn(
                                `No version found for package "${name}". Defaulting to "latest".`
                            );
                        } else {
                            log.debug(`Resolved package "${name}" with version "${version}".`);
                            resolvedVersion = `^${version}`;
                        }
                    } catch (error) {
                        log.warn(
                            `Could not fetch version from npm for package "${name}". Defaulting to "latest".`
                        );
                    }
                }

                if (!args["--dev"] && !args["--peer"] && !args["--optional"]) {
                    if (!pkg.config.hasOwnProperty("dependencies")) {
                        pkg.config.dependencies = {};
                    }

                    pkg.config.dependencies[name] = resolvedVersion;
                }

                if (args["--dev"]) {
                    if (!pkg.config.hasOwnProperty("devDependencies")) {
                        pkg.config.devDependencies = {};
                    }

                    pkg.config.devDependencies[name] = resolvedVersion;
                }

                if (args["--peer"]) {
                    if (!pkg.config.hasOwnProperty("peerDependencies")) {
                        pkg.config.peerDependencies = {};
                    }

                    pkg.config.peerDependencies[name] = resolvedVersion;
                }

                if (args["--optional"]) {
                    if (!pkg.config.hasOwnProperty("optionalDependencies")) {
                        pkg.config.optionalDependencies = {};
                    }

                    pkg.config.optionalDependencies[name] = resolvedVersion;
                }
            }
        }
    }

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

    await npm.withLinkedLocals(pkgs, () => {
        log.info("Installing dependencies.");
        for (const pkg of matchingPkgs) {
            if (args["--no-save"]) {
                npm.install(pkg.path, ["--no-save"]);
            } else {
                npm.install(pkg.path);
            }
        }
    });
};

module.exports = command;
