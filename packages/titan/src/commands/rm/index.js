const kleur = require("kleur");
const semver = require("semver");
const log = require("../../util/log");
const npm = require("../../util/npm");
const git = require("../../util/git");
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
        log.error("You must specify a package to remove.");
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

            if (
                pkg.config.dependencies &&
                pkg.config.dependencies.hasOwnProperty(name) &&
                (version === "latest" ||
                    pkg.config.dependencies[name] === version ||
                    semver.satisfies(pkg.config.dependencies[name], version))
            ) {
                log.debug(
                    `Removing ${kleur
                        .white()
                        .bold(
                            `"${name}@${pkg.config.dependencies[name]}"`
                        )} from package "${pkg.config.name}" in dependencies.`
                );
                delete pkg.config.dependencies[name];
            } else if (
                pkg.config.devDependencies &&
                pkg.config.devDependencies.hasOwnProperty(name) &&
                (version === "latest" ||
                    pkg.config.devDependencies[name] === version ||
                    semver.satisfies(pkg.config.devDependencies[name], version))
            ) {
                log.debug(
                    `Removing ${kleur
                        .white()
                        .bold(
                            `"${name}@${pkg.config.dependencies[name]}`
                        )}" from package "${
                        pkg.config.name
                    }" in devDependencies.`
                );
                delete pkg.config.devDependencies[name];
            } else if (
                pkg.config.peerDependencies &&
                pkg.config.peerDependencies.hasOwnProperty(name) &&
                (version === "latest" ||
                    pkg.config.peerDependencies[name] === version ||
                    semver.satisfies(
                        pkg.config.peerDependencies[name],
                        version
                    ))
            ) {
                log.debug(
                    `Removing "${name}@${pkg.config.dependencies[name]}" from package "${pkg.config.name}" in peerDependencies.`
                );
                delete pkg.config.peerDependencies[name];
            } else if (
                pkg.config.optionalDependencies &&
                pkg.config.optionalDependencies.hasOwnProperty(name) &&
                (version === "latest" ||
                    pkg.config.optionalDependencies[name] === version ||
                    semver.satisfies(
                        pkg.config.optionalDependencies[name],
                        version
                    ))
            ) {
                log.debug(
                    `Removing "${name}@${pkg.config.dependencies[name]}" from package "${pkg.config.name}" in optionalDependencies.`
                );
                delete pkg.config.optionalDependencies[name];
            }
        }
    }

    await npm.withLinkedLocals(pkgs, () => {
        log.info("Installing dependencies.");
        for (const pkg of matchingPkgs) {
            if (args["--no-save"]) {
                npm.install(pkg.path, ["--no-save"]);
            } else {
                npm.install(pkg.path, []);
            }
        }
    });
};

module.exports = command;
