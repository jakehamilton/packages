const semver = require("semver");
const fs = require("../../util/fs");
const log = require("../../util/log");
const git = require("../../util/git");
const npm = require("../../util/npm");
const pkgs = require("../../util/pkgs");
const path = require("../../util/path");

const command = () => {
    log.info("Loading git tags.");
    const tags = git.tag.releases();

    const pkgsData = pkgs.getAllPackageInfo();

    const changes = git.status();

    if (changes.length > 0) {
        log.error("You must commit your changes before running this command.");
        log.error("");
        for (const change of changes) {
            let type;

            switch (change.type) {
                default:
                case "unknown": {
                    type = " ?";
                    break;
                }
                case "modified": {
                    type = " M";
                    break;
                }
                case "added": {
                    type = " A";
                    break;
                }
                case "untracked": {
                    type = "??";
                    break;
                }
            }

            log.error(`${type}: ${path.relative(process.cwd(), change.file)}`);
        }

        process.exit(1);
    }

    const latest = [
        ...git.tag.latestReleases(process.cwd(), pkgsData, tags).values(),
    ];

    const newPkgs = pkgsData.filter((pkg) => {
        const release = latest.find(
            (release) => release.name === pkg.config.name
        );

        return !release;
    });

    const upgrades = git.getAllUpgradesBetween(process.cwd(), latest, "HEAD");

    if (upgrades.length === 0 && newPkgs.length === 0) {
        log.info("No packages to upgrade.");
        process.exit(0);
    }

    for (const upgrade of upgrades) {
        log.trace(
            `Setting new version "${upgrade.newVersion}" for package "${upgrade.name}".`
        );

        upgrade.pkg.config.version = upgrade.newVersion;

        pkgs.writePackageInfo(upgrade.pkg);
    }

    for (const pkg of newPkgs) {
        if (pkg.config.version === "") {
            pkg.config.version = "1.0.0";
        }

        log.trace(
            `Setting version "${pkg.config.version}" for new package "${pkg.config.name}".`
        );

        pkgs.writePackageInfo(pkg);
    }

    const updatedFiles = [
        ...upgrades.map((upgrade) =>
            path.resolve(upgrade.pkg.path, "package.json")
        ),
        ...newPkgs.map((pkg) => path.resolve(pkg.path, "package.json")),
    ];

    log.info("Adding modified files to git.");
    git.add(process.cwd(), updatedFiles);

    log.info("Creating release commit.");
    git.commit(process.cwd(), "chore(release): publish", ["--allow-empty"]);

    const updatedPkgs = [...upgrades.map((upgrade) => upgrade.pkg), ...newPkgs];

    log.info("Tagging releases.");
    for (const pkg of updatedPkgs) {
        const name = `${pkg.config.name}@${pkg.config.version}`;
        git.tag.create(process.cwd(), name, `titan-release:${name}`);
    }
};

module.exports = command;
