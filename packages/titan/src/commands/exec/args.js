const arg = require("arg");

const dashIndex = process.argv.indexOf("--");

const getArgs = () => ({
    ...arg(
        {
            "--help": Boolean,
            "-h": "--help",

            "--verbose": arg.COUNT,
            "-v": "--verbose",

            "--scope": String,
            "-s": "--scope",

            "--changed": Boolean,
            "-c": "--changed",
        },
        {
            permissive: true,
            argv: process.argv.slice(
                2,
                dashIndex > -1 ? dashIndex : process.argv.length
            ),
        }
    ),
    "--": dashIndex > -1 ? process.argv.slice(dashIndex + 1) : [],
});

module.exports = getArgs;
