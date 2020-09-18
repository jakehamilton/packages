const arg = require("arg");

const getArgs = () =>
    arg({
        "--help": Boolean,
        "-h": "--help",
    });

module.exports = getArgs;
