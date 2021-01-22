const kleur = require("kleur");
const log = require("../../util/log");
const cmd = require("../../util/cmd");
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

    if (args["--"].length === 0) {
        log.error("No command specified.");
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

    if (args["--ordered"]) {
        npm.traverseOrdered(matchingPkgs, (pkg) => {
            log.info(
                `${kleur.white().bold(pkg.config.name)} ${args["--"].join(" ")}`
            );
            const output = cmd.exec(args["--"].join(" "), {
                cwd: pkg.path,
                encoding: "utf8",
                stdio: "pipe",
            });

            const lines = output.split("\n");

            for (const line of lines) {
                if (line.trim() !== "") {
                    log.info(
                        `${kleur.white().bold(pkg.config.name)} > ${line}`
                    );
                }
            }

            process.stdout.write("\n");
        });
    } else {
        for (const pkg of matchingPkgs) {
            log.info(
                `${kleur.white().bold(pkg.config.name)} ${args["--"].join(" ")}`
            );
            const output = cmd.exec(args["--"].join(" "), {
                cwd: pkg.path,
                encoding: "utf8",
                stdio: "pipe",
            });

            const lines = output.split("\n");

            for (const line of lines) {
                if (line.trim() !== "") {
                    log.info(
                        `${kleur.white().bold(pkg.config.name)} > ${line}`
                    );
                }
            }

            process.stdout.write("\n");
        }
    }
};

module.exports = command;
