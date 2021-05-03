const AbortController = require("abort-controller");
const cache = require("./cache");

const log = require("./log");
const colors = require("./colors");
const { pkgsToDependencyMap } = require("./npm");

const runTasks = async (map, options, signal, cb, onError) => {
    if (signal.aborted) {
        return;
    }

    let itemsToBuild = [];

    for (const item of map.values()) {
        if (item.dependencies.size === 0) {
            itemsToBuild.push(item);
        }
    }

    return await Promise.all(
        itemsToBuild.map(async (item) => {
            const color = colors.unique();

            if (options.cache) {
                const cacheStatus = await cache.getCacheStatus(item.pkg);

                item.useCache = item.useCache || cacheStatus.useCache;
            }

            if (item.useCache) {
                log.info(color(`${item.pkg.config.name} using cache.`));
            }

            try {
                const promise = item.useCache
                    ? Promise.resolve()
                    : cb(item.pkg, options, color, signal);

                await promise;

                map.delete(item.pkg.config.name);

                for (const otherItem of map.values()) {
                    if (otherItem.dependencies.has(item.pkg.config.name)) {
                        otherItem.dependencies.delete(item.pkg.config.name);

                        if (item.useCache) {
                            otherItem.useCache = true;
                        }
                    }
                }

                if (options.cache) {
                    const newCacheStatus = await cache.getCacheStatus(item.pkg);

                    cache.updateCacheMap(newCacheStatus);
                }

                return await runTasks(map, options, signal, cb, onError);
            } catch (error) {
                onError(error);
            }
        })
    );
};

const executeOrdered = async (pkgs, options, cb) => {
    if (cb === undefined && typeof options === "function") {
        cb = options;
        options = {};
    } else if (typeof cb === undefined) {
        throw new Error(`No callback provided to "task.executeUnordered".`);
    }

    const map = pkgsToDependencyMap(pkgs);

    const controller = new AbortController();

    try {
        await runTasks(map, options, controller.signal, cb, () => {
            controller.abort();
        });
    } catch (error) {
        controller.abort();
    }
};

const executeUnordered = async (pkgs, options, cb) => {
    if (cb === undefined && typeof options === "function") {
        cb = options;
        options = {};
    } else if (typeof cb === undefined) {
        throw new Error(`No callback provided to "task.executeUnordered".`);
    }

    const controller = new AbortController();

    try {
        await Promise.all(
            pkgs.map(async (pkg) => {
                let useCache = false;
                if (options.cache) {
                    const cacheStatus = await cache.getCacheStatus(pkg);

                    useCache = cacheStatus.useCache;
                }

                const color = colors.unique();

                if (useCache) {
                    log.info(color(`${pkg.config.name} using cache.`));
                }

                const promise = useCache
                    ? Promise.resolve()
                    : cb(pkg, options, color, controller.signal);

                await promise;

                if (options.cache) {
                    const newCacheStatus = await cache.getCacheStatus(item.pkg);

                    cache.updateCacheMap(newCacheStatus);
                }
            })
        );
    } catch (error) {
        controller.abort();
    }
};

const execute = async (pkgs, options, cb) => {
    if (cb === undefined && typeof options === "function") {
        cb = options;
        options = {};
    } else if (typeof cb === undefined) {
        throw new Error(`No callback provided to "task.execute".`);
    }

    const { ordered = false } = options;

    if (ordered) {
        await executeOrdered(pkgs, options, cb);
    } else {
        await executeUnordered(pkgs, options, cb);
    }

    if (options.cache) {
        cache.writeCacheMap();
    }
};

module.exports = {
    execute,
    executeOrdered,
    executeUnordered,
};
