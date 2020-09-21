const { execSync } = require("child_process");
const semver = require("semver");
const log = require("./log");

const install = (root = process.cwd(), args = []) => {
    execSync(`npm install ${args.join(" ")}`, {
        cwd: root,
        stdio: "pipe",
    });
};

const parseNameWithVersion = (name) => {
    const match = /(?<name>@?.+)@(?<version>.+)/.exec(name);

    if (match) {
        return {
            name: match.groups.name,
            version: match.groups.version,
        };
    } else {
        throw new Error(`Unable to parse package name with version "${name}".`);
    }
};

const dedupe = (tags) => {
    const pkgs = new Map();

    for (const tag of tags) {
        const { name, version } = parseNameWithVersion(tag);

        if (!pkgs.has(name)) {
            pkgs.set(name, version);
        } else {
            const otherVersion = pkgs.get(name);

            if (semver.gt(version, otherVersion)) {
                pkgs.set(name, version);
            }
        }
    }

    return [...pkgs.entries()].map(([name, version]) => `${name}@${version}`);
};

const publish = (pkg) => {
    log.info(
        `Publishing package "${pkg.config.name}" with version "${pkg.config.version}".`
    );
    execSync("npm publish", {
        cwd: pkg.path,
        encoding: "utf8",
        stdio: "inherit",
    });
};

module.exports = {
    install,
    parseNameWithVersion,
    dedupe,
    publish,
};
