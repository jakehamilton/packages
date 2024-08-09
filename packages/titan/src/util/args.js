const arg = require("arg");

const args = {
    "--help": Boolean,
    "-h": "--help",

    "--verbose": arg.COUNT,
    "-v": "--verbose",

		"--version": Boolean,
		"-V": "--version",
};

module.exports = args;
