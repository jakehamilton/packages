const arg = require("arg");
const rootArgs = require("../../util/args");

const dashIndex = process.argv.indexOf("--");

const getArgs = () => ({
    ...arg(
        {
            ...rootArgs,
            "--scope": String,
            "-s": "--scope",

            "--changed": Boolean,
            "-c": "--changed",

            "--tagged": Boolean,
            "-t": "--tagged",

            "--ordered": Boolean,
            "-o": "--ordered",

            "--cache": Boolean,
            "-C": "--cache",
        },
        {
            argv: process.argv.slice(
                2,
                dashIndex > -1 ? dashIndex : process.argv.length
            ),
        }
    ),
    "--": dashIndex > -1 ? process.argv.slice(dashIndex + 1) : [],
});

module.exports = getArgs;
