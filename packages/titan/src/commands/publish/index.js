const log = require("../../util/log");
const git = require("../../util/git");
const npm = require("../../util/npm");
const pkgs = require("../../util/pkgs");

const command = () => {
    const tags = git.tag.at(process.cwd()).filter((tag) => tag !== "");

    if (tags.length === 0) {
        log.info("No tags for current commit, nothing to publish.");
        process.exit(0);
    }

    const pkgsData = pkgs.getAllPackageInfo();

    for (const tag of npm.dedupe(tags)) {
        const { name, version } = npm.parseNameWithVersion(tag);

        const pkg = pkgsData.find((pkg) => pkg.config.name === name);

        if (pkg) {
            npm.publish(pkg);
        }
    }
};

module.exports = command;
