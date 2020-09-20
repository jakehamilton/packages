const fs = require("./fs");
const log = require("./log");
const path = require("./path");

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
            log.info(`Loading packages in "${pkgsDir}".`);
            for (const pkgDir of fs.readDir(pkgsDir)) {
                if (fs.isDir(path.resolve(pkgsDir, pkgDir))) {
                    const pkg = JSON.parse(
                        fs.read(path.resolve(pkgsDir, pkgDir, "package.json"))
                    );

                    log.debug(`Loaded config for package "${pkg.name}".`);

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
    }
};

module.exports = {
    getAllPackageInfo,
    writePackageInfo,
};
