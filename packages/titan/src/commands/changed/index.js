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

    const pkgsData = pkgs.getAllPackageInfo();

    const tags = git.tag.releases();

    const latest = [
        ...git.tag.latestReleases(process.cwd(), pkgsData, tags).values(),
    ];

    for (const release of latest) {
        const changes = git.getChangesBetween(
            process.cwd(),
            release.tag.name,
            "HEAD",
            release.pkg
        );

        if (changes.length == 0) {
            continue;
        }

        log.info(
            chalk`{white ${release.name}} has ${changes.length} change${
                changes.length === 1 ? "" : "s"
            } since version "${release.version}".`
        );
    }
};

module.exports = command;
