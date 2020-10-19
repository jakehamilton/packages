const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () => ({
    ...arg(
        {
            ...rootArgs,
            "--force": Boolean,
            "-f": "--force",

            "--private": Boolean,
            "-p": "--private",

            "--name": String,
            "-n": "--name",
        },
        {
            permissive: true,
        }
    ),
});

module.exports = getArgs;
