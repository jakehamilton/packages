const arg = require("arg");

const getArgs = () =>
    arg(
        {
            "--help": Boolean,
            "-h": "--help",

            "--force": Boolean,
            "-f": "--force",

            "--private": Boolean,
            "-p": "--private",
        },
        {
            permissive: true,
        }
    );

module.exports = getArgs;
