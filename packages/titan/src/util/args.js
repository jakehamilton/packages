const arg = require("arg");

const args = arg(
    {
        "--help": Boolean,
        "-h": "--help",
    },
    {
        permissive: true,
    }
);

module.exports = args;
