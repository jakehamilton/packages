const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () => ({
    ...arg(
        {
            ...rootArgs,
        },
        {
            permissive: true,
        }
    ),
});

module.exports = getArgs;
