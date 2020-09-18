const arg = require("arg");

const args = arg({
    "--help": Boolean,
    "-h": "--help",

    "--force": Boolean,
    "-f": "--force",

    "--name": String,
});

module.exports = args;
