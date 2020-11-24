const log = require("../../util/log");
const npm = require("../../util/npm");
const git = require("../../util/git");
const help = require("./help");
const getArgs = require("./args");

const command = () => {
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
        const releases = git.tag.latestReleases();

        for (const release of releases.values()) {
            if (git.changedSince(release)) {
                changed.push(release.name);
            }
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

    log.info("Bootstrapping packages.");
    npm.withLinkedLocals(pkgs, () => {
        for (const { pkg, transitive } of locals.values()) {
            if (transitive) {
                log.info(
                    `Installing dependencies for transitive dependency "${pkg.config.name}".`
                );
            } else {
                log.info(`Installing dependencies for "${pkg.config.name}".`);
            }

            if (args["--no-save"]) {
                npm.install(pkg.path, ["--no-save"]);
            } else {
                npm.install(pkg.path);
            }
        }
    });
};

module.exports = command;
