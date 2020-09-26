const { execSync } = require("child_process");
const semver = require("semver");
const log = require("./log");
const pkgs = require("./pkgs");

const install = (root = process.cwd(), args = []) => {
    execSync(`npm install ${args.join(" ")}`, {
        cwd: root,
        stdio: "pipe",
    });
};

const parseNameWithVersion = (name) => {
    const match = /(?<name>@?[^@]+)(?:@(?<version>.+))?/.exec(name);

    if (match) {
        return {
            name: match.groups.name,
            version: match.groups.version || "latest",
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

const patchDependenciesWithLocals = (pkgsMap, dependencies) => {
    for (const [name, version] of Object.entries(dependencies)) {
        if (pkgsMap.has(name)) {
            const local = pkgsMap.get(name);
            if (semver.satisfies(local.config.version, version)) {
                dependencies[name] = `file:${local.path}`;
            }
        }
    }

    return dependencies;
};

const withLinkedLocals = (pkgsData, fn) => {
    const pkgsMap = pkgsData.reduce((data, pkg) => {
        data.set(pkg.config.name, pkg);
        return data;
    }, new Map());

    for (const pkg of pkgsData) {
        const dependencies = patchDependenciesWithLocals(pkgsMap, {
            ...(pkg.config.dependencies || {}),
        });
        const devDependencies = patchDependenciesWithLocals(pkgsMap, {
            ...(pkg.config.devDependencies || {}),
        });
        const optionalDependencies = patchDependenciesWithLocals(pkgsMap, {
            ...(pkg.config.optionalDependencies || {}),
        });
        const peerDependencies = patchDependenciesWithLocals(pkgsMap, {
            ...(pkg.config.peerDependencies || {}),
        });

        const newPkg = {
            ...pkg,
            config: {
                ...pkg.config,
                dependencies,
                devDependencies,
                optionalDependencies,
                peerDependencies,
            },
        };

        pkgs.writePackageInfo(newPkg);
    }

    fn();

    for (const pkg of pkgsData) {
        pkgs.writePackageInfo(pkg);
    }
};

module.exports = {
    install,
    parseNameWithVersion,
    dedupe,
    publish,
    withLinkedLocals,
};
