const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const DTSWebpackPlugin = require("..");

const SRC_DIR = path.resolve(__dirname, "src");
const DIST_DIR = path.resolve(__dirname, "dist");

const config = {
    mode: "production",
    devtool: "source-map",
    entry: "./src/index.ts",
    output: {
        filename: "test.dist.js",
        library: "Test",
        libraryTarget: "umd",
        libraryExport: "default",
        globalObject: "self !== undefined ? self : this",
    },
    externals: {
        react: {
            amd: "react",
            root: "React",
            commonjs: "react",
            commonjs2: "react",
        },
        "react-dom": {
            amd: "react-dom",
            root: "ReactDOM",
            commonjs: "react-dom",
            commonjs2: "react-dom",
        },
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
        alias: {
            "@components": path.resolve(SRC_DIR, "components/"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: [
                    "cache-loader",
                    {
                        loader: "ts-loader",
                        options: {},
                    },
                ],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
            },
        }),
        new DTSWebpackPlugin({
            name: "@test/ui",
            match: (name) => !name.match(/\.stories$/),
            transform: (statement) => {
                const match = statement.match(/import ["']([^"']+)["']/);

                if (match && match[1].match(/\.css$/)) {
                    return "";
                }
            },
        }),
    ],
};

module.exports = config;
