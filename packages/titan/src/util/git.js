const { execSync } = require("child_process");
const semver = require("semver");
const npm = require("./npm");
const path = require("./path");
const logger = require("./log");

const init = (root) => {
    execSync("git init", {
        cwd: root,
        stdio: "pipe",
    });
};

const diff = (options = []) => {
    const result = execSync(`git diff ${options.join(" ")}`, {
        cwd: npm.getProjectRoot(),
        encoding: "utf8",
        stdio: "pipe",
    });

    return result.split("\n");
};

const add = (files = [], options = [], root = npm.getProjectRoot()) => {
    execSync(`git add ${files.join(" ")} ${options.join(" ")}`, {
        cwd: root,
        stdio: "pipe",
    });
};

const commit = (
    message = "chore: commit",
    options = [],
    root = npm.getProjectRoot()
) => {
    execSync(`git commit -m "${message}" ${options.join(" ")}`, {
        cwd: root,
        stdio: "pipe",
    });
};

const status = () => {
    const result = execSync(`git status --porcelain`, {
        cwd: npm.getProjectRoot(),
        encoding: "utf8",
        stdio: "pipe",
    });

    const lines = result.split("\n");
    const items = lines.reduce((items, line) => {
        const match = /^(?<type>M|A|\?\?)\s+(?<file>.+)$/.exec(line.trim());

        if (match) {
            let type;
            switch (match.groups.type) {
                default:
                    type = "unknown";
                    break;
                case "M": {
                    type = "modified";
                    break;
                }
                case "A": {
                    type = "added";
                    break;
                }
                case "??": {
                    type = "untracked";
                    break;
                }
            }

            items.push({
                type,
                file: path.resolve(root, match.groups.file),
            });
        }

        return items;
    }, []);

    return items;
};

const printChanges = (changes) => {
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

        logger.error(`${type}: ${path.relative(root, change.file)}`);
    }
};

const log = (options = []) => {
    const root = npm.getProjectRoot();
    const result = execSync(`git log ${options.join(" ")}`, {
        cwd: root,
        encoding: "utf8",
        stdio: "pipe",
    });

    return result;
};

const getCommitDataBetween = (from, to) => {
    const START_SEPARATOR = `#TITAN_START_COMMIT`;
    const END_SEPARATOR = `#TITAN_END_COMMIT`;
    const raw = log([
        // https://mirrors.edge.kernel.org/pub/software/scm/git/docs/git-log.html#_pretty_formats
        `--format="format:${START_SEPARATOR}%n%cn%n%ce%n%G?%n%s%n%b%n${END_SEPARATOR}"`,
        "--name-only",
        `${from}..${to}`,
    ]);

    const lines = raw.trim().split("\n");

    const commits = [];

    let cur = 0;
    while (cur < lines.length) {
        if (lines[cur].trim() === START_SEPARATOR) {
            cur++;

            const author = lines[cur];
            cur++;
            const email = lines[cur];
            cur++;

            const signed = lines[cur];
            cur++;

            const title = lines[cur];
            cur++;

            const body = [];
            while (cur < lines.length && lines[cur].trim() !== END_SEPARATOR) {
                body.push(lines[cur]);
                cur++;
            }

            cur++;

            const changes = [];

            while (
                cur < lines.length &&
                lines[cur].trim() !== START_SEPARATOR
            ) {
                changes.push(lines[cur]);
                cur++;
            }

            commits.push({
                author,
                email,
                signed,
                title,
                body: body.join("\n"),
                changes,
            });
        }

        cur++;
    }

    return commits;
};

const getChangesBetween = (from, to, pkg) => {
    const root = npm.getProjectRoot();
    const fileDiff = diff(["--name-only", from, to]);

    const fileChanges = fileDiff.filter((file) =>
        path.resolve(root, file).startsWith(pkg.path)
    );

    if (fileChanges.length === 0) {
        return [];
    }

    const commits = getCommitDataBetween(from, to);

    const affectingCommits = commits.filter((commit) => {
        const change = commit.changes.find((file) =>
            path.resolve(root, file).startsWith(pkg.path)
        );

        return Boolean(change);
    });

    return affectingCommits;
};

const changedSince = (release, target = "HEAD") => {
    const changes = getChangesBetween(release.tag.name, target, release.pkg);

    return changes.length !== 0;
};

const getUpgradeBetween = (release, target = "HEAD") => {
    const commits = getChangesBetween(release.tag.name, target, release.pkg);

    if (commits.length === 0) {
        return null;
    }

    let bump = "patch";

    for (const commit of commits) {
        if (commit.body.match(/^BREAKING CHANGE/g)) {
            bump = "major";
            break;
        }

        if (commit.title.startsWith("feat")) {
            bump = "minor";
        }
    }

    const newVersion = semver.inc(release.version, bump);

    if (newVersion === null) {
        logger.error(
            `Could not perform bump "${bump}" on version "${release.version}" for package "${release.name}".`
        );
        process.exit(1);
    }

    return {
        name: release.name,
        version: release.version,
        newVersion,
        pkg: release.pkg,
    };
};

const getAllUpgradesBetween = (releases, target = "HEAD") => {
    const upgrades = [];

    for (const release of releases) {
        const upgrade = getUpgradeBetween(release, target);

        if (upgrade !== null) {
            upgrades.push(upgrade);
        }
    }

    return upgrades;
};

const tag = {
    at(target = "HEAD") {
        const result = execSync(`git tag --points-at ${target}`, {
            cwd: npm.getProjectRoot(),
            encoding: "utf8",
            stdio: "pipe",
        });

        return result.trim().split("\n").filter(Boolean);
    },
    list() {
        const raw = execSync(`git tag --list -n1 --sort=-taggerdate`, {
            cwd: npm.getProjectRoot(),
            encoding: "utf8",
            stdio: "pipe",
        });

        const lines = raw.split("\n");
        const tags = lines.reduce((tags, line) => {
            const match = /(?<tag>\S+)\s*(?<annotation>.+)?/.exec(line);

            if (match) {
                tags.push({
                    name: match.groups.tag,
                    annotation: match.groups.annotation || "",
                });
            }

            return tags;
        }, []);

        return tags;
    },
    releases() {
        return this.list().filter((tag) =>
            tag.annotation.startsWith("titan-release:")
        );
    },
    latestReleases(
        pkgs = npm.getAllPackages(),
        tags = this.releases(npm.getProjectRoot())
    ) {
        const latest = new Map();

        for (const tag of tags) {
            const { name, version } = npm.parseNameWithVersion(tag.name);

            if (!latest.has(name)) {
                if (pkgs.has(name)) {
                    latest.set(name, {
                        name,
                        tag,
                        version,
                        pkg: pkgs.get(name),
                    });
                }
            }
        }

        return latest;
    },
    create(name, message) {
        execSync(`git tag ${name} ${message ? `-m "${message}"` : ""}`, {
            cwd: npm.getProjectRoot(),
            stdio: "pipe",
        });
    },
};

const config = {
    get(key) {
        const result = execSync(`git config --get ${key}`, {
            encoding: "utf8",
            stdio: "pipe",
        });

        return result.trim();
    },
};

module.exports = {
    init,
    add,
    commit,
    status,
    printChanges,
    diff,
    log,
    getCommitDataBetween,
    getChangesBetween,
    changedSince,
    getUpgradeBetween,
    getAllUpgradesBetween,
    tag,
    config,
};
