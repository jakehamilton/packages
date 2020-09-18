const fs = require("../../util/fs");

const log = require("../../util/log");
const git = require("../../util/git");
const path = require("../../util/path");
const args = require("../../util/args");

const help = require("./help");

const command = () => {
    if (args["--help"]) {
        help();
        process.exit(0);
    }

    if (args._.length === 1) {
        log.error("Missing positional arguments.");
        help();
        process.exit(1);
    }

    const cwd = process.cwd();
    const root = path.resolveRelative(args._[1]);
    const name = args["--name"] || path.basename(root);

    if (root === cwd) {
        log.error("Cannot initialize the current directory.");
        process.exit(1);
    }

    if (cwd.startsWith(root)) {
        log.error("Cannot initialize the current directory's ancestor.");
        process.exit(1);
    }

    log.info(
        `Initializing new project "${name}" in "${path.relative(cwd, root)}".`
    );

    if (fs.exists(root)) {
        if (args["--force"]) {
            log.info("Removing existing directory.");
            fs.rm(root);
        } else {
            log.error(
                `Directory already exists. Use --force to automatically remove it.`
            );
            process.exit(1);
        }
    }

    log.info("Creating directory.");
    fs.mkdir(root);

    // Scaffold packages directory
    log.info("Scaffolding project.");

    const packages = path.resolve(root, "packages");

    fs.mkdir(packages);
    fs.touch(path.resolve(packages, ".gitkeep"));

    const pkg = require("./package.template.json");

    const user = {
        name: git.config.get("user.name"),
        email: git.config.get("user.email"),
    };

    pkg.name = name;
    pkg.author = `${user.name} <${user.email}>`;

    fs.write(path.resolve(root, "package.json"), JSON.stringify(pkg, null, 2));
};

module.exports = command;
