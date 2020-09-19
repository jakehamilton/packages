---
title: "dts-webpack-plugin"
sidebar: auto
---

# @jakehamilton/dts-webpack-plugin

> Generate type definitions after your webpack build.

## Installation

```shell
npm install --save-dev @jakehamilton/dts-webpack-plugin
```

## Usage

In your Webpack configuration, import and use this plugin.

```js
const DTSWebpackPlugin = require("@jakehamilton/dts-webpack-plugin");

module.exports = {
    /* Add the plugin to the array of plugins */
    plugins: [
        new DTSWebpackPlugin({
            // Optional root directory to search for package.json,
            // tsconfig.json, and code in.
            root: "/my/project/",

            // Optional arguments for the typescript compiler.
            tsc: "--strict",

            // Optional path to a tsconfig.json file.
            tsconfig: "/my/project/tsconfig.json",

            // Optional function to determine whether a module should be
            // included or not.
            match: (name) => !name.endsWith(".stories.ts"),

            // Optional map of transformations.
            transforms: {
                module: (origin, identifier, line, files, aliases) => {
                    // `origin` is the module that an import/export takes place.
                    // `identifier` is the name/path of the import/export.
                    // `line` is the whole line where the import/export occurs.
                    // `files` is an object containing all type definition files and their contents.
                    // `aliases` is an object of aliases from your tsconfig.json file.

                    // Example removing css imports
                    // WARNING: this only works if the import was written on one line.
                    if (identifier.endsWith(".css")) {
                        return "";
                    }
                },
            },
        }),
    ],
};
```
