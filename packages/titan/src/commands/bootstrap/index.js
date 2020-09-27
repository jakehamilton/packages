const log = require("../../util/log");
const npm = require("../../util/npm");
const help = require("./help");
const getArgs = require("./args");

const command = () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    const pkgs = npm.getAllPackages();

    const cycles = npm.detectCycles(pkgs);

    if (cycles.length > 0) {
        log.error("Cyclic dependencies detected. Fix these to continue:");
        log.error("");

        for (const cycle of cycles) {
            log.error(
                `Cycle: ${cycle.map((name) => `"${name}"`).join(" -> ")}`
            );
        }

        process.exit(1);
    }

    log.info("Bootstrapping packages.");
    npm.withLinkedLocals(pkgs, () => {
        for (const pkg of pkgs.values()) {
            log.info(`Installing dependencies for "${pkg.config.name}".`);
            npm.install(pkg.path);
        }
    });
};

module.exports = command;
