const chalk = require("chalk");
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

    for (const pkg of matchingPkgs) {
        if (!pkg.config.scripts || !pkg.config.scripts[name]) {
            log.debug(
                `No script "${name}" found in package "${pkg.config.name}".`
            );
            continue;
        }

        let command = `npm run ${name}`;

        if (args["--"].length > 0) {
            command += `-- ${args["--"].join(" ")}`;
        }

        log.info(chalk`{white ${pkg.config.name}} ${command}`);
        const output = cmd.exec(command, {
            cwd: pkg.path,
            encoding: "utf8",
            stdio: "pipe",
        });

        const lines = output.split("\n");

        for (const line of lines) {
            if (line.trim() !== "") {
                log.info(chalk`{white ${pkg.config.name}} ${line}`);
            }
        }
    }
};

module.exports = command;