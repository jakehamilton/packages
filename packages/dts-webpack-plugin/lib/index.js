"use strict";

const validate = require("schema-utils");
const log = require("./log");
const util = require("./util");
const schema = require("./schema.json");

const DEFAULT_OPTIONS = {
    root: process.cwd(),
    entry: "index.ts",
    bundle: false,
    output: "",
    tsc: "",
    tsconfig: "tsconfig.json",
    include: [],
    match: () => true,
    transforms: {
        module: () => undefined,
    },
};

class DTSWebpackPlugin {
    constructor(o = {}) {
        log.trace("Created plugin instance.");
        log.trace("Normalizing options.");

        const root = o.root || DEFAULT_OPTIONS.root;
        const name = o.name || util.getPackageName(root);

        this.options = {
            ...DEFAULT_OPTIONS,
            ...o,
            name,
            transforms: o.transforms
                ? {
                      ...DEFAULT_OPTIONS.transforms,
                      ...o.transforms,
                  }
                : DEFAULT_OPTIONS.transforms,
        };

        this.meta = {
            name: "DTSWebpackPlugin",
        };

        log.trace("Validating options.");
        validate(schema, this.options, this.meta);

        const tsconfig = util.getTSConfig(root, this.options.tsconfig);

        this.base = util.getTSBaseUrl(root, tsconfig);
        this.aliases = util.getTSPaths(tsconfig);

        this.compile = this.compile.bind(this);
    }

    apply(compiler) {
        compiler.hooks.afterCompile.tapAsync(
            this.meta,
            (compilation, callback) => {
                util.withTempDir((dir) => this.compile(compilation, dir)).then(
                    callback
                );
            }
        );
    }

    compile(compilation, temp) {
        log.info("Starting compilation of type definitions.");
        log.trace("Generating types.");
        util.generateTypes(this.options.root, temp.name, this.options.tsc);

        log.trace("Loading generated type definition files.");
        const files = util.loadDTSFiles(temp.name, this.options.match);

        log.trace("Transforming modules.");
        const modules = util.transformFiles(files, this.options, this.aliases);

        log.trace("Writing results.");
        util.write(modules, this.options, compilation.compiler.outputPath);

        const numberOfModules = Object.keys(modules).length;
        log.info(`Generated ${numberOfModules} modules.`);
    }
}

module.exports = DTSWebpackPlugin;
