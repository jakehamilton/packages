const { execSync } = require("child_process");

const exec = (command, options) => {
    return execSync(command, options);
};

module.exports = {
    exec,
};
