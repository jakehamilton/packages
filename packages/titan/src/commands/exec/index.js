const chalk = require("chalk");
const log = require("../../util/log");
const cmd = require("../../util/cmd");
const git = require("../../util/git");
const pkgs = require("../../util/pkgs");
const getArgs = require("./args");

const command = () => {
    const args = getArgs();

    if (args["--"].length === 0) {
        log.error("No command specified.");
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

    const pkgsData = pkgs.getAllPackageInfo();

    const scope = args["--scope"] || ".+";

    log.debug(`Creating matcher for scope "${scope}".`);
    const scopeRegex = new RegExp(scope);

    const matchingPkgs = pkgsData.filter((pkg) => {
        if (args["--changed"] && !changed.includes(pkg.config.name)) {
            return false;
        }

        return pkg.config.name.match(scopeRegex);
    });

    if (matchingPkgs.length === 0) {
        log.info("No matching packages.");
        process.exit(0);
    }

    for (const pkg of matchingPkgs) {
        const output = cmd.exec(args["--"].join(" "), {
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
