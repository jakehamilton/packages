const arg = require("arg");

const getArgs = () =>
    arg({
        "--help": Boolean,
        "-h": "--help",

        "--force": Boolean,
        "-f": "--force",

        "--name": String,
        "-n": "--name",

        "--skip-install": Boolean,
        "-x": "--skip-install",

        "--skip-git": Boolean,
        "-X": "--skip-git",
    });

module.exports = getArgs;
