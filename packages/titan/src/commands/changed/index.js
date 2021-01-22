const kleur = require("kleur");
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
                    `New package ${kleur
                        .white()
                        .bold(pkg.config.name)} was created.`
                );
            } else {
                log.info(
                    `Package ${kleur.white().bold(release.name)} has ${
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
