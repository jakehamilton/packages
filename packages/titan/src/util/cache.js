const crypto = require("crypto");
const fs = require("./fs");
const npm = require("./npm");
const path = require("./path");
const log = require("./log");

let CACHE_MAP = null;

const CACHE_DIR = path.resolve(npm.getProjectRoot(), ".titan");

const CACHE_MAP_PATH = path.resolve(CACHE_DIR, "map.json");

const getCacheMap = () => {
    if (CACHE_MAP) {
        return CACHE_MAP;
    }

    if (!fs.exists(CACHE_DIR)) {
        fs.mkdir(CACHE_DIR);
    }

    if (fs.exists(CACHE_MAP_PATH)) {
        try {
            CACHE_MAP = JSON.parse(
                fs.read(CACHE_MAP_PATH, {
                    encoding: "utf8",
                })
            );
        } catch (error) {
            log.error(`Could not parse cache map at "${CACHE_MAP_PATH}".`);
            CACHE_MAP = {};
        }
    } else {
        fs.touch(CACHE_MAP_PATH);

        CACHE_MAP = {};

        fs.write(CACHE_MAP_PATH, JSON.stringify(CACHE_MAP, null, 2));
    }

    return CACHE_MAP;
};

const writeCacheMap = () => {
    if (CACHE_MAP === null) {
        log.fatal("Cache map is null.");
        process.exit(1);
    }
    fs.write(CACHE_MAP_PATH, JSON.stringify(CACHE_MAP, null, 2));
};

const updateCacheMap = (cacheStatus) => {
    CACHE_MAP[cacheStatus.path] = cacheStatus.status;
};

const getHash = (file) =>
    new Promise(async (resolve, reject) => {
        const stats = await fs.stat(file);
        const hash = crypto.createHash("sha1");

        if (stats.isDirectory()) {
            const children = await fs.readDirAsync(file);

            const childHashes = await Promise.all(
                children.map((child) => getHash(path.resolve(file, child)))
            );

            for (const childHash of childHashes) {
                hash.update(childHash);
            }

            resolve(hash.digest("hex"));
        } else {
            const readStream = fs.createReadStream(file);
            readStream.pipe(hash);

            hash.on("finish", (result) => {
                resolve(hash.digest("hex"));
            });
        }
    });

const getArtifacts = async (pkg) => {
    const { artifacts = [] } = pkg.config.titan || {};

    const hashes = await Promise.all(
        artifacts.map((artifact) => getHash(path.resolve(pkg.path, artifact)))
    );

    return artifacts.reduce((result, artifact, i) => {
        result[artifact] = hashes[i];
        return result;
    }, {});
};

const getCacheStatus = async (pkg) => {
    const cacheMap = getCacheMap();
    const pkgPath = path.relative(npm.getProjectRoot(), pkg.path);

    const lastStatus = cacheMap[pkgPath];
    const pkgStat = fs.statSync(pkg.path);

    const currentArtifacts = await getArtifacts(pkg);

    if (!lastStatus) {
        return {
            path: pkgPath,
            status: {
                mtime: pkgStat.mtime,
                artifacts: currentArtifacts,
            },
            useCache: false,
        };
    }

    const titanConfig = pkg.config.titan || {};

    const useCache = titanConfig.artifacts
        ? titanConfig.artifacts.length ===
              Object.keys(currentArtifacts).length &&
          titanConfig.artifacts.every(
              (artifact) =>
                  currentArtifacts[artifact] &&
                  lastStatus.artifacts[artifact] &&
                  currentArtifacts[artifact] === lastStatus.artifacts[artifact]
          )
        : pkgStat.mtime !== lastStatus.mtime;

    return {
        path: pkgPath,
        status: {
            mtime: pkgStat.mtime,
            artifacts: currentArtifacts,
        },
        useCache,
    };
};

module.exports = {
    getCacheMap,
    writeCacheMap,
    updateCacheMap,
    getCacheStatus,
};
