const kleur = require("kleur");
const starters = require("@starters/core");
const fs = require("../../util/fs");
const log = require("../../util/log");
const path = require("../../util/path");
const npm = require("../../util/npm");

const help = require("./help");
const getArgs = require("./args");

const command = async () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    if (args._.length === 1) {
        log.error("No name specified.");
        help();
        process.exit(1);
    }

    const name = args._[1];

    if (path.isPath(name)) {
        log.error("Name cannot be a path.");
        process.exit(1);
    }

    const rootPkgPath = npm.getProjectRoot();
    const pkg = npm.getProjectRootConfig();

    if (!pkg.titan.packages) {
        log.error(
            `Root configuration has no ${kleur
                .white()
                .bold(`titan.packages`)} property.`
        );
        process.exit(1);
    }

    const root = path.resolveRelative(args._[2] || pkg.titan.packages[0]);

    let isPkgMapped = false;
    for (const pkgPath of pkg.titan.packages) {
        const resolvedPkgPath = path.resolveRelative(pkgPath, rootPkgPath);

        if (root === resolvedPkgPath) {
            isPkgMapped = true;
        }
    }

    if (!isPkgMapped) {
        log.warn(
            `Root configuration's ${kleur
                .white()
                .bold(
                    `titan.packages`
                )} property does not include ${kleur
                .white()
                .bold(path.relative(rootPkgPath, root))}.`
        );
    }

    if (!root) {
        log.error("No destination available.");
        process.exit(1);
    }

    if (!fs.exists(root)) {
        log.info("Creating destination directory.");
        fs.mkdir(root);
    } else if (!fs.isDir(root)) {
        log.info("Creating destination directory.");
        fs.mkdir(root);
    }

    const target = path.resolve(root, name);

    if (fs.exists(target)) {
        if (args["--force"] && fs.isDir(target)) {
            log.debug(
                `Removing existing directory ${kleur.white().bold(target)}.`
            );
            fs.rm(target);
        } else {
            log.error(
                "Package already exists at path, use `--force` to override."
            );
            process.exit(1);
        }
    }

    log.info("Creating package directory.");
    fs.mkdir(target);

    const template = args["--template"] || "@starters/empty";

    try {
        await starters.create(
            target,
            template,
            args["--name"] || path.basename(name),
            args
        );
    } catch (error) {
        log.error("Could not create package.");
        log.error("Cleaning up.");
        fs.rm(target);
        process.exit(1);
    }
};

module.exports = command;
