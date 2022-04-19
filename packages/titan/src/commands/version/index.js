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
        log.debug(
            `Setting new version "${upgrade.newVersion}" for package "${upgrade.name}".`
        );

        npm.upgradeLocalDependents(pkgs, upgrade);

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

    const updatedPkgs = [...upgrades.map((upgrade) => upgrade.pkg), ...newPkgs];

    const { upstream, downstream } = npm.upgradeDownstreamPackages(updatedPkgs);

    const updatedFiles = [
        ...upgrades.map((upgrade) =>
            path.resolve(upgrade.pkg.path, "package.json")
        ),
        ...newPkgs.map((pkg) => path.resolve(pkg.path, "package.json")),
    ];

    for (const pkg of upstream.values()) {
        if (!args["--dry-run"]) {
            npm.writePackageInfo(pkg);

            updatedFiles.push(path.resolve(pkg.path, "package.json"));
        }
    }

    for (const pkg of downstream.values()) {
        if (!args["--dry-run"]) {
            npm.writePackageInfo(pkg);

            updatedFiles.push(path.resolve(pkg.path, "package.json"));
        }
    }

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

                const note = downstream.has(upgrade.name)
                    ? "Updated local dependencies."
                    : undefined;

                const newContents = changelog.patch(contents, upgrade, note);

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

        for (const pkg of downstream.values()) {
            const isUpgrade = Boolean(
                upgrades.find((upgrade) => upgrade.pkg === pkg)
            );
            const isNew = Boolean(newPkgs.find((newPkg) => newPkg === pkg));

            if (!isUpgrade && !isNew) {
                const file = path.resolve(pkg.path, "CHANGELOG.md");
                const contents = fs.read(file, { encoding: "utf8" });
                const newContents = changelog.patch(
                    contents,
                    {
                        name: pkg.config.name,
                        version: pkg.config.version,
                        newVersion: pkg.config.version,
                        pkg,
                        commits: [],
                        bump: "patch",
                    },
                    "Updated local dependencies."
                );

                fs.write(file, newContents);
                git.add([file]);
            }
        }

        log.info("Adding modified files to git.");
        git.add(updatedFiles);

        log.info("Creating release commit.");
        const commitStart = performance.now();
        git.commit("chore(release): publish", ["--allow-empty"]);
        const commitEnd = performance.now();

        log.info("Tagging releases...");
        const tagStart = performance.now();
        for (const pkg of updatedPkgs) {
            const name = `${pkg.config.name}@${pkg.config.version}`;
            log.debug(`Tagging release "${name}".`);
            git.tag.create(name, `titan-release:${name}`);
        }

        for (const pkg of downstream.values()) {
            const isUpgrade = Boolean(
                upgrades.find((upgrade) => upgrade.pkg === pkg)
            );
            const isNew = Boolean(newPkgs.find((newPkg) => newPkg === pkg));

            if (!isUpgrade && !isNew) {
                const name = `${pkg.config.name}@${pkg.config.version}`;
                log.debug(`Tagging downstream release "${name}".`);
                git.tag.create(name, `titan-release:${name}`);
            }
        }
        const tagEnd = performance.now();

        log.trace(
            `Commit completed in ${((commitEnd - commitStart) / 1000).toFixed(
                5
            )}s.`
        );
        log.trace(
            `Tag completed in ${((tagEnd - tagStart) / 1000).toFixed(5)}s.`
        );

        log.info("Done tagging releases.");
    }
};

module.exports = command;
