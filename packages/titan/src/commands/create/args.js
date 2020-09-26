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
        },
        {
            permissive: true,
        }
    ),
});

module.exports = getArgs;
