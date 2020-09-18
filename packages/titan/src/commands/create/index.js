const fs = require("../../util/fs");
const log = require("../../util/log");
const path = require("../../util/path");

const help = require("./help");
const getArgs = require("./args");

const command = () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    if (args._.length === 1) {
        log.error("Missing position arguments");
        help();
        process.exit(1);
    }

    const name = args._[1];

    if (path.isPath(name)) {
        log.error("Name cannot be a path.");
        process.exit(1);
    }

    const pkgPath = path.resolve(process.cwd(), "package.json");

    if (!fs.exists(pkgPath)) {
        log.error(`Unable to load package configuration at "${pkgPath}".`);
        process.exit(1);
    }

    const pkg = JSON.parse(
        fs.read(pkgPath, {
            encoding: "utf8",
        })
    );

    if (!pkg.titan) {
        log.error("Package has no titan config.");
        process.exit(1);
    }

    if (!pkg.titan.packages) {
        log.error("Package has no `titan.packages` property.");
        process.exit(1);
    }

    const where = path.resolveRelative(args._[2] || pkg.titan.packages[0]);

    if (!where) {
        log.error("No destination available.");
        process.exit(1);
    }

    if (!fs.exists(where)) {
        log.info("Creating destination directory.");
        fs.mkdir(where);
    } else if (!fs.isDir(where)) {
        log.info("Creating destination directory.");
        fs.mkdir(where);
    }

    const target = path.resolve(where, name);

    if (fs.exists(target)) {
        log.error("Package already exists at path.");
        process.exit(1);
    }

    log.info("Creating package directory.");
    fs.mkdir(target);
};

module.exports = command;
