const kleur = require("kleur");
const giturl = require("giturl");
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

    const pkgs = npm.getAllPackages();

    const scope = args["--scope"] || ".+";

    log.debug(`Creating matcher for scope "${scope}".`);
    const scopeRegex = new RegExp(scope);

    const matchingPkgs = [...pkgs.values()].filter((pkg) => {
        return pkg.config.name.match(scopeRegex);
    });

    if (matchingPkgs.length === 0) {
        log.info("No matching packages.");
        process.exit(0);
    }

    try {
        const origin = git.config.get("remote.origin.url");
        log.trace(`Found origin url "${origin}".`);

        const url = giturl.parse(origin);
        log.debug(`Repository url parsed as "${url}".`);

        log.info("Writing metadata");

        for (const pkg of matchingPkgs) {
            const { config } = pkg;

            config.homepage = url;
            config.repository = {
                type: "git",
                url: `${url}.git`,
            };
            config.bugs = {
                url: `${url}/issues`,
            };

            log.debug(`Writing metadata for package "${config.name}".`);
            npm.writePackageInfo(pkg);
        }
    } catch (error) {
        log.error("Could not get repository origin URL.");
        log.error("Have you added an origin remote?");
        throw error;
    }
};

module.exports = command;
