const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () =>
    arg({
        ...rootArgs,

        "--scope": String,
        "-s": "--scope",

        "--changed": Boolean,
        "-c": "--changed",

        "--tagged": Boolean,
        "-t": "--tagged",

        "--no-save": Boolean,
        "-S": "--no-save",
    });

module.exports = getArgs;
