const chalk = require("chalk");
const semver = require("semver");
const fs = require("../../util/fs");
const log = require("../../util/log");
const npm = require("../../util/npm");
const path = require("../../util/path");
const pkgs = require("../../util/pkgs");
const help = require("./help");
const getArgs = require("./args");

const command = () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    const pkgsData = pkgs.getAllPackageInfo(process.cwd());

    const cycles = pkgs.detectCycles(pkgsData);

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
    npm.withLinkedLocals(pkgsData, () => {
        for (const pkg of pkgsData) {
            log.info(`Installing dependencies for "${pkg.config.name}".`);
            npm.install(pkg.path);
        }
    });
};

module.exports = command;
