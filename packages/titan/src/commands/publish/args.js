const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () =>
    arg({
        ...rootArgs,

        "--dry-run": Boolean,
        "-d": "--dry-run",
    });

module.exports = getArgs;
