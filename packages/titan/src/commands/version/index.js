const semver = require("semver");
const fs = require("../../util/fs");
const log = require("../../util/log");
const git = require("../../util/git");
const npm = require("../../util/npm");
const path = require("../../util/path");
const changelog = require("../../util/changelog");
const help = require("./help");
const getArgs = require("./args");

const command = () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    if (args["--dry-run"]) {
        log.info("Executing dry run.");
    }

    log.info("Loading git tags.");
    const tags = git.tag.releases();

    const pkgs = npm.getAllPackages();

    const changes = git.status();

    if (changes.length > 0) {
        log.error("You must commit your changes before running this command.");
        log.error("");
        git.printChanges(changes);
        process.exit(1);
    }

    const latest = [...git.tag.latestReleases(pkgs, tags).values()];

    const newPkgs = [...pkgs.values()].filter((pkg) => {
        const release = latest.find(
            (release) => release.name === pkg.config.name
        );

        return !release;
    });

    const upgrades = git.getAllUpgradesBetween(latest, "HEAD");

    if (upgrades.length === 0 && newPkgs.length === 0) {
        log.info("No packages to upgrade.");
        process.exit(0);
    }

    for (const upgrade of upgrades) {
        log.trace(
            `Setting new version "${upgrade.newVersion}" for package "${upgrade.name}".`
        );

        upgrade.pkg.config.version = upgrade.newVersion;

        if (!args["--dry-run"]) {
            npm.writePackageInfo(upgrade.pkg);
        }
    }

    for (const pkg of newPkgs) {
        if (pkg.config.version === "") {
            pkg.config.version = "1.0.0";
        }

        log.trace(
            `Setting version "${pkg.config.version}" for new package "${pkg.config.name}".`
        );

        if (!args["--dry-run"]) {
            npm.writePackageInfo(pkg);
        }
    }

    const updatedFiles = [
        ...upgrades.map((upgrade) =>
            path.resolve(upgrade.pkg.path, "package.json")
        ),
        ...newPkgs.map((pkg) => path.resolve(pkg.path, "package.json")),
    ];

    const updatedPkgs = [...upgrades.map((upgrade) => upgrade.pkg), ...newPkgs];

    if (args["--dry-run"]) {
        for (const pkg of updatedPkgs) {
            log.info(
                `Package "${pkg.config.name}" set to version "${pkg.config.version}".`
            );
        }
    } else {
        log.info("Updating changelogs.");
        for (const upgrade of upgrades) {
            const file = path.resolve(upgrade.pkg.path, "CHANGELOG.md");

            if (fs.exists(file)) {
                const contents = fs.read(file, { encoding: "utf8" });
                const newContents = changelog.patch(contents, upgrade);

                fs.write(file, newContents);
                git.add([file]);
            } else {
                const contents = changelog.create(upgrade.pkg, upgrade);

                fs.write(file, contents);
                git.add([file]);
            }
        }

        for (const pkg of newPkgs) {
            const file = path.resolve(pkg.path, "CHANGELOG.md");

            const contents = changelog.create(
                pkg,
                undefined,
                `Created package "${pkg.config.name}".`
            );

            fs.write(file, contents);
            git.add([file]);
        }

        log.info("Adding modified files to git.");
        git.add(updatedFiles);

        log.info("Creating release commit.");
        git.commit("chore(release): publish", ["--allow-empty"]);

        log.info("Tagging releases.");
        for (const pkg of updatedPkgs) {
            const name = `${pkg.config.name}@${pkg.config.version}`;
            git.tag.create(name, `titan-release:${name}`);
        }
    }
};

module.exports = command;
