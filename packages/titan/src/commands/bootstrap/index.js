const semver = require("semver");
const fs = require("../../util/fs");
const log = require("../../util/log");
const npm = require("../../util/npm");
const path = require("../../util/path");
const pkgs = require("../../util/pkgs");
const help = require("./help");
const getArgs = require("./args");

const command = () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    const pkgsData = pkgs.getAllPackageInfo(process.cwd());

    const cycles = pkgs.detectCycles(pkgsData);

    if (cycles.length > 0) {
        log.error("Cyclic dependencies detected. Fix these to continue:");
        log.error("");

        for (const cycle of cycles) {
            log.error(
                `Cycle: ${cycle.map((name) => `"${name}"`).join(" -> ")}`
            );
        }

        process.exit(1);
    }

    const pkgsMap = pkgsData.reduce((data, pkg) => {
        data.set(pkg.config.name, pkg);
        return data;
    }, new Map());

    log.info("Bootstrapping packages.");
    for (const [name, pkg] of pkgsMap.entries()) {
        const allDependencies = {
            ...(pkg.config.dependencies || {}),
            ...(pkg.config.devDependencies || {}),
            ...(pkg.config.optionalDependencies || {}),
            ...(pkg.config.peerDependencies || {}),
        };

        const deps = Object.keys(allDependencies).reduce(
            (deps, name) => {
                const version = allDependencies[name];

                if (pkgsMap.has(name)) {
                    if (
                        semver.satisfies(
                            pkgsMap.get(name).config.version,
                            version
                        )
                    ) {
                        deps.local.push(pkgsMap.get(name));
                    } else {
                        log.debug(
                            `Local package "${name}" could not be used in "${pkg.config.name}" because of version requirements.`
                        );
                        deps.external.push({
                            name,
                            version,
                        });
                    }
                } else {
                    deps.external.push({
                        name,
                        version,
                    });
                }

                return deps;
            },
            {
                local: [],
                external: [],
            }
        );

        const modules = path.resolve(pkg.path, "node_modules");

        if (!fs.exists(modules)) {
            fs.mkdir(modules);
        }

        log.debug(`Linking local packages for package "${name}".`);
        for (const local of deps.local) {
            const target = path.resolve(modules, local.config.name);
            if (fs.exists(target)) {
                fs.rm(target);
            }

            fs.link(local.path, target);
        }

        log.debug(`Installing external dependencies for package "${name}".`);
        npm.install(
            pkg.path,
            deps.external.map((dep) => `${dep.name}@${dep.version}`)
        );
    }
};

module.exports = command;
