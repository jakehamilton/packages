const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () => ({
    ...arg(
        {
            ...rootArgs,
            "--force": Boolean,
            "-f": "--force",

            "--name": String,
            "-n": "--name",

            "--skip-install": Boolean,
            "-x": "--skip-install",

            "--skip-git": Boolean,
            "-X": "--skip-git",
        },
        {
            permissive: true,
        }
    ),
});

module.exports = getArgs;