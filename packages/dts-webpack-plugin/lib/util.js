"use strict";
const fs = require("fs");
const path = require("path");
const rm = require("rimraf");
const tmp = require("tmp");
const run = require("npm-run");
const mkdir = require("mkdirp");
const log = require("./log");

const compose = (...fns) => (x) => fns.reduceRight((x, f) => f(x), x);

const curry = (f) => (...args) =>
    args.length >= f.length ? f(...args) : curry(f.bind(f, ...args));

const getPackageName = (root) => {
    try {
        const file = path.resolve(root, "package.json");

        log.trace(`Checking for package.json at path "${file}".`);

        const exists = fs.existsSync(file);

        if (exists) {
            log.debug("Importing package.json.");
            const pkg = JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
            return pkg.name;
        }
    } catch (error) {
        log.error("Unable to import package.json file.");
        log.error(error);
    }

    log.debug("Using default package name.");

    return "unknown-package";
};

const getTSConfig = (root, name) => {
    try {
        const file = path.resolve(root, name);

        log.trace(`Checking for tsconfig.json at path "${file}".`);

        const exists = fs.existsSync(file);

        if (exists) {
            log.debug("Importing tsconfig.json.");
            const tsconfig = JSON.parse(
                fs.readFileSync(file, { encoding: "utf8" })
            );

            return tsconfig;
        } else {
            log.error(`Unable to find tsconfig at path "${file}".`);
        }
    } catch (error) {
        log.error("Unable to import tsconfig.json file.");
        log.error(error);
    }

    log.error("Using default tsconfig.");
    return {};
};

const getTSBaseUrl = (root, tsconfig) => {
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.baseUrl) {
        return path.resolve(tsconfig.compilerOptions.baseUrl);
    } else {
        return root;
    }
};

const getTSPaths = (tsconfig) => {
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
        const paths = {};

        for (const [alias, targets] of Object.entries(
            tsconfig.compilerOptions.paths
        )) {
            paths[alias.replace(/\*$/, "")] = targets.map((target) =>
                target.replace(/\*$/, "")
            );
        }

        return paths;
    } else {
        return {};
    }
};

const withTempDir = (fn) =>
    new Promise((resolve, reject) => {
        try {
            const dir = tmp.dirSync();
            Promise.resolve(fn(dir)).then(() => {
                try {
                    rm.sync(path.resolve(dir.name, "*"));
                    dir.removeCallback();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });

const generateTypes = (root, target, options) => {
    const command = `tsc --declaration --emitDeclarationOnly --declarationDir ${target} ${options}`;

    log.trace("Running typescript compiler:");
    log.trace(`  ${command}`);
    try {
        run.sync(command, {
            cwd: root,
        });
    } catch (error) {
        log.error("Error running typescript compiler.");
        log.error(`Command failed: "${command}".`);
        log.error(error);
        throw error;
    }
};

const loadDTSFiles = (target, match) => {
    const getFiles = (dir) => {
        let files = [];

        for (const name of fs.readdirSync(dir)) {
            const file = path.resolve(dir, name);
            if (fs.statSync(file).isDirectory()) {
                log.trace(`Traversing directory: "${name}".`);
                files = files.concat(getFiles(file));
            } else if (name.match(/\.d\.ts$/) && match(name)) {
                log.trace(`Found file: "${name}".`);
                files.push(file);
            }
        }

        return files;
    };

    let files = {};

    for (const file of getFiles(target)) {
        files[path.relative(target, file)] = fs.readFileSync(file, {
            encoding: "utf8",
        });
    }

    return files;
};

const withTS = (name) => {
    if (name.match(/\.ts$/)) {
        return name;
    } else {
        return `${name}.ts`;
    }
};

const withDTS = (name) => {
    if (name.match(/\.d\.ts$/) || name.match(/\.ts$/)) {
        return name;
    } else {
        return `${name}.d.ts`;
    }
};

const importExists = (name, files) => {
    return (
        files.hasOwnProperty(name) ||
        files.hasOwnProperty(withTS(name)) ||
        files.hasOwnProperty(withDTS(name))
    );
};

const resolveRelativeImport = (name, identifier, files, options, aliases) => {
    if (identifier === ".") {
        const target = `${path.dirname(name)}/index`;
        if (importExists(target, files)) {
            return "./index";
        } else {
            log.error(`Could not resolve relative import "${identifier}".`);
            return identifier;
        }
    }

    const target = path.relative(
        process.cwd(),
        path.resolve(path.dirname(name), identifier)
    );

    const relativePath = path.relative(path.dirname(name), target);

    if (importExists(target, files)) {
        return `./${relativePath}`;
    } else if (importExists(`${target}/index`, files)) {
        return `./${relativePath}/index`;
    } else {
        log.error(`Could not resolve relative import "${identifier}".`);
        return identifier;
    }
};

const resolveNonRelativeImport = (
    name,
    identifier,
    files,
    options,
    aliases
) => {
    for (const [alias, targets] of Object.entries(aliases)) {
        if (identifier.startsWith(alias)) {
            for (const target of targets) {
                const file = identifier.replace(alias, target);

                if (importExists(file, files)) {
                    const relativePath = path.relative(
                        path.dirname(name),
                        file
                    );

                    return `./${relativePath}`;
                } else if (importExists(`${file}/index`, files)) {
                    const relativePath = path.relative(
                        path.dirname(name),
                        `${file}/index`
                    );

                    return `./${relativePath}`;
                }
            }

            log.error(`Could not resolve aliased import "${identifier}".`);
        }
    }

    return identifier;
};

const resolveImport = curry((name, pattern, files, options, aliases, line) => {
    const match = line.match(pattern);

    if (match) {
        const [, start, identifier, end] = match;

        const transformed = options.transforms.module(
            name,
            identifier,
            line,
            files,
            aliases
        );

        if (transformed !== undefined && transformed !== null) {
            log.trace(`User generated transformation "${transformed}".`);
            return transformed;
        }

        if (identifier.startsWith(".")) {
            const resolvedIdentifier = resolveRelativeImport(
                name,
                identifier,
                files,
                options,
                aliases
            );

            return line.replace(pattern, `$1${resolvedIdentifier}$3`);
        } else {
            const resolvedIdentifier = resolveNonRelativeImport(
                name,
                identifier,
                files,
                options,
                aliases
            );

            return line.replace(pattern, `$1${resolvedIdentifier}$3`);
        }
    }

    return line;
});

const transformFile = (name, files, options, aliases) => {
    let source = files[name].replace("\r\n", "\n");

    if (options.bundle) {
        source = source.replace(/declare /g, "");
    }

    const lines = source.split("\n");

    const resolve = compose(
        resolveImport(
            name,
            /(import ['"])([^'"]+)(['"])/,
            files,
            options,
            aliases
        ),
        resolveImport(
            name,
            /(from ['"])([^'"]+)(['"])/,
            files,
            options,
            aliases
        ),
        resolveImport(
            name,
            /(import\(['"])([^'"]+)(['"]\))/,
            files,
            options,
            aliases
        )
    );

    const result = lines
        .map((line) => {
            const resolvedLine = resolve(line);

            return resolvedLine;
        })
        .join("\n");

    return result;
};

const transformFiles = (files, options, aliases) => {
    const modules = {};

    for (const name of Object.keys(files)) {
        const file = transformFile(name, files, options, aliases);

        modules[name] = file;
    }

    return modules;
};

const write = (modules, options, root) => {
    for (const [name, source] of Object.entries(modules)) {
        const file = path.resolve(root, name);

        log.trace(`Writing file "${file}".`);
        mkdir.sync(path.dirname(file));

        fs.writeFileSync(file, source);
    }
};

module.exports = {
    curry,
    compose,
    getPackageName,
    getTSConfig,
    getTSBaseUrl,
    getTSPaths,
    withTempDir,
    generateTypes,
    loadDTSFiles,
    transformFile,
    transformFiles,
    write,
};
