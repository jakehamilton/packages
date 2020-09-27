const { execSync } = require("child_process");
const semver = require("semver");
const fs = require("./fs");
const log = require("./log");
const path = require("./path");

let PROJECT_ROOT = null;
const getProjectRoot = () => {
    if (PROJECT_ROOT === null) {
        const parts = process.cwd().split(path.sep);

        for (let i = parts.length; i > 0; i--) {
            const currentPath = parts.slice(0, i).join(path.sep);

            if (currentPath === "") {
                continue;
            }

            const files = fs.readDir(currentPath);

            if (files.find((file) => file === "package.json")) {
                const pkg = JSON.parse(
                    fs.read(path.resolve(currentPath, "package.json"), {
                        encoding: "utf8",
                    })
                );

                if ("titan" in pkg) {
                    PROJECT_ROOT = currentPath;
                    return PROJECT_ROOT;
                }
            }
        }

        log.error("Unable to find project root.");
        process.exit(1);
    } else {
        return PROJECT_ROOT;
    }
};

const getAllPackages = () => {
    const root = getProjectRoot();

    const config = JSON.parse(
        fs.read(path.resolve(root, "package.json"), {
            encoding: "utf8",
        })
    );

    const pkgs = new Map();

    for (const location of config.titan.packages) {
        const pkgsDir = path.resolveRelative(location, root);

        if (fs.exists(pkgsDir)) {
            log.debug(`Loading packages in "${pkgsDir}".`);

            for (const pkgDir of fs.readDir(pkgsDir)) {
                const fullPath = path.resolve(pkgsDir, pkgDir);

                if (fs.isDir(fullPath)) {
                    const pkg = JSON.parse(
                        fs.read(path.resolve(fullPath, "package.json"), {
                            encoding: "utf8",
                        })
                    );

                    log.trace(`Loaded config for package "${pkg.name}".`);

                    pkgs.set(pkg.name, {
                        path: fullPath,
                        config: pkg,
                    });
                }
            }
        } else {
            log.error(`Packages directory "${pkgsDir}" does not exist.`);
        }
    }

    return pkgs;
};

const withLinkedLocals = (pkgs, fn) => {
    for (const pkg of pkgs.values()) {
        const dependencies = patchDependenciesWithLocals(pkgs, {
            ...(pkg.config.dependencies || {}),
        });
        const devDependencies = patchDependenciesWithLocals(pkgs, {
            ...(pkg.config.devDependencies || {}),
        });
        const optionalDependencies = patchDependenciesWithLocals(pkgs, {
            ...(pkg.config.optionalDependencies || {}),
        });
        const peerDependencies = patchDependenciesWithLocals(pkgs, {
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

        writePackageInfo(newPkg);
    }

    fn();

    for (const pkg of pkgs.values()) {
        writePackageInfo(pkg);
    }
};

const getLocalDependencies = (pkg, pkgs) => {
    const locals = new Map();

    const allDependencies = {
        ...(pkg.config.dependencies || {}),
        ...(pkg.config.devDependencies || {}),
        ...(pkg.config.optionalDependencies || {}),
        ...(pkg.config.peerDependencies || {}),
    };

    for (const [name, version] of Object.entries(allDependencies)) {
        if (
            pkgs.has(name) &&
            semver.satisfies(pkgs.get(name).config.version, version)
        ) {
            locals.set(name, pkgs.get(name));
        }
    }

    return locals;
};

const recurseDetectCycles = (pkg, pkgs, known = new Set([pkg])) => {
    const locals = getLocalDependencies(pkg, pkgs);

    for (const local of locals.values()) {
        if (known.has(local)) {
            return [...known, local].map((pkg) => pkg.config.name);
        } else {
            const result = recurseDetectCycles(
                local,
                pkgs,
                new Set([...known, local])
            );

            if (result.length > 0) {
                return result;
            }
        }
    }

    return [];
};

const detectCycles = (pkgs) => {
    const cycles = [];

    for (const pkg of pkgs.values()) {
        const result = recurseDetectCycles(pkg, pkgs);

        if (result.length > 0) {
            cycles.push(result);
        }
    }

    return cycles;
};

const writePackageInfo = (pkg) => {
    if (fs.exists(pkg.path)) {
        fs.write(
            path.resolve(pkg.path, "package.json"),
            JSON.stringify(pkg.config, null, 2)
        );
    } else {
        log.error(
            `Could not write package "${pkg.config.name}" to "${path.resolve(
                pkg.path,
                "package.json"
            )}".`
        );
        process.exit(1);
    }
};

const install = (root = getProjectRoot(), args = []) => {
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

module.exports = {
    getProjectRoot,
    getAllPackages,
    withLinkedLocals,
    detectCycles,
    writePackageInfo,
    parseNameWithVersion,
    dedupe,
    install,
    publish,
};
