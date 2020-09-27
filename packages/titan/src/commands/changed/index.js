const chalk = require("chalk");
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

    const tags = git.tag.releases();

    const latest = git.tag.latestReleases(pkgs, tags);

    let hasChanges = false;

    for (const release of latest.values()) {
        const changes = git.getChangesBetween(
            release.tag.name,
            "HEAD",
            release.pkg
        );

        if (changes.length == 0) {
            continue;
        }

        hasChanges = true;

        log.info(
            chalk`{white ${release.name}} has ${changes.length} change${
                changes.length === 1 ? "" : "s"
            } since version "${release.version}".`
        );
    }

    if (!hasChanges) {
        log.info("No changed packages.");
    }
};

module.exports = command;
