const starters = require("@starters/core");
const fs = require("../../util/fs");
const log = require("../../util/log");
const git = require("../../util/git");
const npm = require("../../util/npm");
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

    if (args["--template"]) {
        try {
            starters.create(root, args["--template"], name);
        } catch (error) {
            log.error("Could not create project.");
            process.exit(1);
        }
    } else {
        log.info("Creating directory.");
        fs.mkdir(root);

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

        fs.write(
            path.resolve(root, "package.json"),
            JSON.stringify(pkg, null, 4) + "\n"
        );

        fs.write(
            path.resolve(root, ".prettierignore"),
            fs.read(path.resolve(__dirname, "prettierignore.template"))
        );

        fs.write(
            path.resolve(root, ".gitignore"),
            fs.read(path.resolve(__dirname, "gitignore.template"))
        );

        if (args["--skip-git"]) {
            log.info("Skipping git initialization.");
        } else {
            log.info("Initializing git repository.");
            git.init(root);
        }

        if (args["--skip-install"]) {
            log.info("Skipping installing dependencies.");
        } else {
            log.info("Installing dependencies.");
            npm.install(root);
        }

        if (!args["--skip-git"]) {
            log.info("Committing changes.");
            git.add([], ["-A"], root);
            git.commit("chore: initial commit", [], root);
        }
    }
};

module.exports = command;
