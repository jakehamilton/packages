const semver = require("semver");
const fs = require("../../util/fs");
const log = require("../../util/log");
const git = require("../../util/git");
const npm = require("../../util/npm");
const pkgs = require("../../util/pkgs");
const path = require("../../util/path");

const command = () => {
    log.info("Loading git tags.");
    const tags = git.tag
        .list()
        .filter((tag) => tag.annotation.startsWith("titan-release:"));

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

    if (tags.length === 0) {
        log.info(
            "No previous releases found, creating a new one for all packages."
        );

        log.info("Normalizing package configs.");
        let modified = [];

        for (const pkg of pkgsData) {
            if (pkg.config.version === "") {
                pkg.config.version = "1.0.0";
                modified.push(pkg);
            }
        }

        for (const pkg of modified) {
            pkgs.writePackageInfo(pkg);
        }

        if (modified.length > 0) {
            log.info("Adding modified files to git.");
            git.add(
                process.cwd(),
                modified.map((pkg) => path.resolve(pkg.path, "package.json"))
            );
        }

        log.info("Creating release commit.");
        git.commit(process.cwd(), "chore(release): publish", ["--allow-empty"]);

        log.info("Tagging releases.");
        for (const pkg of pkgsData) {
            const name = `${pkg.config.name}@${pkg.config.version}`;
            git.tag.create(process.cwd(), name, `titan-release:${name}`);
        }
    } else {
        const latest = new Map();

        for (const tag of tags) {
            const { name, version } = npm.parseNameWithVersion(tag.name);

            if (latest.has(name)) {
                continue;
            } else {
                const pkg = pkgsData.find((data) => data.config.name === name);

                if (pkg) {
                    latest.set(name, {
                        tag,
                        version,
                        pkg,
                    });
                }
            }
        }

        const upgrades = [];

        for (const [name, { version, pkg, tag }] of latest.entries()) {
            const diff = git.diff(process.cwd(), [
                "--name-only",
                tag.name,
                "HEAD",
            ]);

            const changes = diff.filter((file) => {
                return path.resolve(process.cwd(), file).startsWith(pkg.path);
            });

            if (changes.length === 0) {
                log.info(`No changes for package "${name}".`);
                continue;
            }

            const commits = git.getCommitDataBetween(
                process.cwd(),
                tag.name,
                "HEAD"
            );

            const affectingCommits = commits.filter((commit) => {
                const change = commit.changes.find((file) => {
                    return path
                        .resolve(process.cwd(), file)
                        .startsWith(pkg.path);
                });

                return Boolean(change);
            });

            if (affectingCommits.length === 0) {
                log.info(`Package "${name}" does not require a new version.`);
                continue;
            }

            let bump = "patch";

            for (const commit of affectingCommits) {
                if (commit.body.match(/^BREAKING CHANGE/g)) {
                    bump = "major";
                    break;
                }

                if (commit.title.startsWith("feat")) {
                    bump = "minor";
                }
            }

            log.trace(`Bumping package "${name}" for "${bump}" release.`);
            const newVersion = semver.inc(version, bump);

            if (newVersion === null) {
                log.error(
                    `Could not perform bump "${bump}" on version "${version}" for package "${name}".`
                );
                process.exit(1);
            }

            upgrades.push({
                name,
                version,
                newVersion,
                pkg,
            });
        }

        if (upgrades.length === 0) {
            log.info("No packages to upgrade.");
            process.exit(0);
        }

        for (const upgrade of upgrades) {
            log.trace(
                `Setting new version "${upgrade.newVersion}" for package "${upgrade.name}".`
            );

            upgrade.pkg.config.version = upgrade.newVersion;

            fs.write(
                path.resolve(upgrade.pkg.path, "package.json"),
                JSON.stringify(upgrade.pkg.config, null, 2)
            );
        }

        log.info("Adding modified files to git.");
        git.add(
            process.cwd(),
            upgrades.map((upgrade) =>
                path.resolve(upgrade.pkg.path, "package.json")
            )
        );

        log.info("Creating release commit.");
        git.commit(process.cwd(), "chore(release): publish", ["--allow-empty"]);

        log.info("Tagging releases.");
        for (const upgrade of upgrades) {
            const name = `${upgrade.pkg.config.name}@${upgrade.pkg.config.version}`;
            git.tag.create(process.cwd(), name, `titan-release:${name}`);
        }
    }
};

module.exports = command;
