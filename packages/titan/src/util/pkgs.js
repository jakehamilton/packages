const fs = require("./fs");
const log = require("./log");
const path = require("./path");
const semver = require("semver");

const getAllPackageInfo = (root = process.cwd()) => {
    const rootPkg = JSON.parse(
        fs.read(path.resolve(root, "package.json"), {
            encoding: "utf8",
        })
    );

    const pkgs = [];

    for (const dir of rootPkg.titan.packages) {
        const pkgsDir = path.resolveRelative(dir);
        if (!fs.exists(pkgsDir)) {
            log.error(`Packages directory "${pkgsDir}" does not exist.`);
        } else {
            log.debug(`Loading packages in "${pkgsDir}".`);
            for (const pkgDir of fs.readDir(pkgsDir)) {
                if (fs.isDir(path.resolve(pkgsDir, pkgDir))) {
                    const pkg = JSON.parse(
                        fs.read(path.resolve(pkgsDir, pkgDir, "package.json"))
                    );

                    log.trace(`Loaded config for package "${pkg.name}".`);

                    pkgs.push({
                        path: path.resolve(pkgsDir, pkgDir),
                        config: pkg,
                    });
                }
            }
        }
    }

    return pkgs;
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

const getLocalPackages = (pkg, pkgs) => {
    const pkgsMap = pkgs.reduce((data, pkg) => {
        data.set(pkg.config.name, pkg);
        return data;
    }, new Map());

    const local = [];

    const allDependencies = {
        ...(pkg.config.dependencies || {}),
        ...(pkg.config.devDependencies || {}),
        ...(pkg.config.optionalDependencies || {}),
        ...(pkg.config.peerDependencies || {}),
    };

    for (const [name, version] of Object.entries(allDependencies)) {
        if (
            pkgsMap.has(name) &&
            semver.satisfies(pkgsMap.get(name).config.version, version)
        ) {
            local.push(pkgsMap.get(name));
        }
    }

    return local;
};

const getExternalPackages = (pkgs) => {};

const recurseDetectCycles = (pkg, pkgs, known = new Set([pkg])) => {
    const locals = getLocalPackages(pkg, pkgs);

    for (const local of locals) {
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
    for (pkg of pkgs) {
        const result = recurseDetectCycles(pkg, pkgs);

        if (result.length > 0) {
            cycles.push(result);
        }
    }

    return cycles;
};

module.exports = {
    getAllPackageInfo,
    writePackageInfo,
    getLocalPackages,
    getExternalPackages,
    detectCycles,
};
