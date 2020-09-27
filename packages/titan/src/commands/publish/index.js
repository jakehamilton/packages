const log = require("../../util/log");
const git = require("../../util/git");
const npm = require("../../util/npm");
const help = require("./help");
const getArgs = require("./args");

const command = () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    const changes = git.status();

    if (changes.length > 0) {
        log.error("You must commit your changes before running this command.");
        log.error("");
        git.printChanges(changes);
        process.exit(1);
    }

    const tags = git.tag.at();

    if (tags.length === 0) {
        log.info("No tags for current commit, nothing to publish.");
        process.exit(0);
    }

    const pkgs = npm.getAllPackages();

    if (args["--dry-run"]) {
        log.info("Executing dry run.");
    }

    for (const tag of npm.dedupe(tags)) {
        const { name } = npm.parseNameWithVersion(tag);

        if (pkgs.has(name)) {
            const pkg = pkgs.get(name);
            if (args["--dry-run"]) {
                log.info(
                    `Publish package "${pkg.config.name}" at version "${pkg.config.version}".`
                );
            } else {
                npm.publish(pkg);
            }
        }
    }
};

module.exports = command;
