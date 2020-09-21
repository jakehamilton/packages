const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () => ({
    ...rootArgs,
});

module.exports = getArgs;
