const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () =>
    arg({
        ...rootArgs,

        "--scope": String,
        "-s": "--scope",
    });

module.exports = getArgs;
