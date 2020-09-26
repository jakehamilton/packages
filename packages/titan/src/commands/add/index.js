const chalk = require("chalk");
const semver = require("semver");
const fs = require("../../util/fs");
const log = require("../../util/log");
const cmd = require("../../util/cmd");
const npm = require("../../util/npm");
const git = require("../../util/git");
const pkgs = require("../../util/pkgs");
const path = require("../../util/path");
const help = require("./help");
const getArgs = require("./args");

const command = () => {
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
        const releases = git.tag.latestReleases(process.cwd());

        for (const release of releases.values()) {
            if (git.changedSince(process.cwd(), release)) {
                changed.push(release.name);
            }
        }
    }

    const tagged = [];

    if (args["--tagged"]) {
        const tags = git.tag.at(process.cwd());

        for (const tag of tags) {
            const { name } = npm.parseNameWithVersion(tag);

            tagged.push(name);
        }
    }

    const pkgsData = pkgs.getAllPackageInfo();

    const pkgsMap = pkgsData.reduce((data, pkg) => {
        data.set(pkg.config.name, pkg);
        return data;
    }, new Map());

    const scope = args["--scope"] || ".+";

    log.debug(`Creating matcher for scope "${scope}".`);
    const scopeRegex = new RegExp(scope);

    const matchingPkgs = pkgsData.filter((pkg) => {
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

            if (pkgsMap.has(name)) {
                if (
                    version === "latest" ||
                    semver.satisfies(pkgsMap.get(name).config.version, version)
                ) {
                    const localVersion =
                        version === "latest"
                            ? pkgsMap.get(name).config.version
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
                }
            }
        }
    }

    npm.withLinkedLocals(pkgsData, () => {
        log.info("Installing dependencies.");
        for (const pkg of matchingPkgs) {
            npm.install(pkg.path);
        }
    });
};

module.exports = command;
