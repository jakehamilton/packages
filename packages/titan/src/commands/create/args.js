const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () => ({
    ...arg(
        {
            ...rootArgs,
            "--force": Boolean,
            "-f": "--force",

            "--template": String,
            "-t": "--template",

            "--name": String,
            "-n": "--name",
        },
        {
            permissive: false,
        }
    ),
});

module.exports = getArgs;
