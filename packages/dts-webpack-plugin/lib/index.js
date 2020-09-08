"use strict";
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const rm = require("rimraf");
const run = require("npm-run");
const littlelog = require("@littlethings/log");

const log = littlelog.create("DTSWebpackPlugin");

const DTS_REGEX = /\.d\.ts$/;

const meta = {
    name: "DTSWebpackPlugin",
};

const defaults = {
    tsc: "",
    root: process.cwd(),
    name: "",
    entry: "index.ts",
    include: [],
    output: path.resolve(process.cwd(), "index.d.ts"),
    config: path.resolve(process.cwd(), "tsconfig.json"),
    match: (name) => true,
    transform: (source) => undefined,
};

class DTSWebpackPlugin {
    constructor(options = {}) {
        this.options = {
            ...defaults,
            ...options,
        };

        this.tmp = null;

        if (!this.options.name) {
            try {
                const pkg = require(path.resolve(
                    this.options.root,
                    "package.json"
                ));

                this.options.name = pkg.name;
            } catch (error) {
                log.error(
                    "No module name provided and unable to load `package.json`."
                );
                throw error;
            }
        }

        try {
            const tsconfig = require(this.options.config);

            this.alias = {};

            if (
                tsconfig &&
                tsconfig.compilerOptions &&
                tsconfig.compilerOptions.paths
            ) {
                for (const [alias, targets] of Object.entries(
                    tsconfig.compilerOptions.paths
                )) {
                    this.alias[
                        alias.replace(/\*$/, "")
                    ] = targets.map((target) => target.replace(/\*$/, ""));
                }
            }
        } catch (error) {
            log.error(
                `Could not load tsconfig at path: "${this.options.config}".`
            );
            throw error;
        }
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap(meta, (compilation) => {
            try {
                log.trace("Starting `afterEmit` process.");
                log.trace("Creating temporary directory.");
                this.tmp = tmp.dirSync();
                log.debug(`Created temporary directory "${this.tmp.name}".`);

                this.compile(compilation.options);

                log.trace(`Removing temporary directory "${this.tmp.name}".`);
                rm.sync(path.resolve(this.tmp.name, "*"));
                this.tmp.removeCallback();
                log.debug("Removed temporary directory.");
            } catch (error) {
                log.error("Error during compilation process.");
                log.error(error);
                throw error;
            }
        });
    }

    compile(options) {
        const command = `tsc --declaration --emitDeclarationOnly --declarationDir ${this.tmp.name} ${this.options.tsc}`;

        log.trace("Running typescript compiler:");
        log.trace(`  ${command}`);
        run.sync(command, {
            cwd: this.options.root,
        });
        log.trace(`Finished running typescript compiler.`);

        const modules = this.loadModules();
        const bundle = this.mergeModules(modules, options);
        this.render(bundle);
    }

    render(bundle) {
        const file = path.relative(process.cwd(), this.options.output);

        fs.writeFileSync(file, bundle);
    }

    resolveImportInLine(options, modules, name, regex, line) {
        const match = line.match(regex);

        if (match) {
            let transformed = this.options.transform(line);
            if (transformed !== undefined) {
                return transformed;
            }

            if (match[2].startsWith(".")) {
                let target = path.relative(
                    process.cwd(),
                    path.resolve(name, `../${match[2]}`)
                );

                if (!modules.hasOwnProperty(target)) {
                    target += "/index";
                }

                log.trace(`Relative import "${target}".`);
                return line.replace(
                    regex,
                    `$1${this.options.name}/${target}$3`
                );
            } else {
                log.trace(`Non-relative import "${match[2]}".`);

                for (const [alias, targets] of Object.entries(this.alias)) {
                    if (match[2].startsWith(alias)) {
                        for (const possibleTarget of targets) {
                            const newTarget = match[2].replace(
                                alias,
                                possibleTarget
                            );

                            if (modules.hasOwnProperty(newTarget)) {
                                return line.replace(
                                    regex,
                                    `$1${this.options.name}/${newTarget}$3`
                                );
                            }

                            if (modules.hasOwnProperty(`${newTarget}/index`)) {
                                return line.replace(
                                    regex,
                                    `$1${this.options.name}/${newTarget}/index$3`
                                );
                            }
                        }

                        log.error(`Could not find module "${match[2]}".`);
                    }
                }
            }
        }

        return line;
    }

    resolveImports(options, modules, name, source) {
        const result = source
            .replace("\r\n", "\n")
            .replace(/declare /g, "")
            .split("\n")
            .map((line) => {
                const lineWithSideEffects = this.resolveImportInLine(
                    options,
                    modules,
                    name,
                    /(import ['"])([^'"]+)(['"])/,
                    line
                );

                const lineWithImports = this.resolveImportInLine(
                    options,
                    modules,
                    name,
                    /(from ['"])([^'"]+)(['"])/,
                    lineWithSideEffects
                );

                const lineWithDynamicImports = this.resolveImportInLine(
                    options,
                    modules,
                    name,
                    /(import\(['"])([^'"]+)(['"]\))/,
                    lineWithImports
                );

                return lineWithDynamicImports;
            })
            .join("\n");

        return result;
    }

    mergeModules(modules, options) {
        let source = [];

        const entryName = this.options.entry
            .replace(/\\/g, "/")
            .replace(/(?:\.d)?\.ts$/g, "");

        const entry = modules[entryName];

        if (!entry) {
            log.error(`Entry file "${this.options.entry}" not found.`);
            log.error("Here are the modules that do exist:");
            for (const name of Object.keys(modules)) {
                log.error(`  ${name}`);
            }
            return;
        }

        for (const file of this.options.include) {
            source.push(
                fs.readFileSync(file, {
                    encoding: "utf8",
                })
            );
        }

        for (const [name, content] of Object.entries(modules)) {
            if (this.options.match(name)) {
                const sanitizedSource = this.resolveImports(
                    options,
                    modules,
                    name,
                    content.replace("declare", "")
                );
                source.push(
                    `declare module "${this.options.name}/${name}" {
${sanitizedSource}
}`
                );
            }
        }

        source.push(
            `declare module "${this.options.name}" {
import entry = require("${this.options.name}/${entryName}");
export = entry;
}`
        );

        source.push(this.resolveImports(options, modules, entryName, entry));

        return source.join("\n");
    }

    loadModules() {
        const modules = {};

        const files = this.getTypeDefinitionFiles(this.tmp.name);

        for (const file of files) {
            const name = this.resolveModule(this.tmp.name, file);

            modules[name] = fs.readFileSync(file, {
                encoding: "utf8",
            });
        }

        return modules;
    }

    resolveModule(from, to) {
        return path
            .relative(from, to)
            .replace(/\\/g, "/")
            .replace(/(?:\.d)?\.ts$/g, "");
    }

    getTypeDefinitionFiles(directory) {
        let files = [];

        for (const name of fs.readdirSync(directory)) {
            const file = path.resolve(directory, name);
            if (fs.statSync(file).isDirectory()) {
                log.trace(`Traversing directory: "${name}".`);
                files = files.concat(this.getTypeDefinitionFiles(file));
            } else if (DTS_REGEX.exec(name)) {
                log.trace(`Found file: "${name}".`);
                files.push(file);
            }
        }

        return files;
    }
}

module.exports = DTSWebpackPlugin;
