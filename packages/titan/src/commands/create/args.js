const arg = require("arg");

const getArgs = () =>
    arg({
        "--help": Boolean,
        "-h": "--help",

        "--force": Boolean,
        "-f": "--force",
    });

module.exports = getArgs;
