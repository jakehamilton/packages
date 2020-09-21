const arg = require("arg");

const args = arg(
    {
        "--help": Boolean,
        "-h": "--help",

        "--verbose": arg.COUNT,
        "-v": "--verbose",
    },
    {
        permissive: true,
    }
);

module.exports = args;
