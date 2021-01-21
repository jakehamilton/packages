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

    const changed = git.getChangedPackages();

    if (changed.length === 0) {
        log.info("No changed packages.");
    } else {
        for (const { release, changes, pkg } of changed) {
            if (release === null) {
                log.info(
                    chalk`New package {white.bold ${pkg.config.name}} was created.`
                );
            } else {
                log.info(
                    chalk`Package {white.bold ${release.name}} has ${
                        changes.length
                    } change${changes.length === 1 ? "" : "s"} since version "${
                        release.version
                    }".`
                );
            }
        }
    }
};

module.exports = command;
