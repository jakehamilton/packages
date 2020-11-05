const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () => ({
    ...arg(
        {
            ...rootArgs,
        },
        {
            permissive: false,
        }
    ),
});

module.exports = getArgs;
