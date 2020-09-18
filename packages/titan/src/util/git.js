const { execSync } = require("child_process");

const config = {
    get(key) {
        const result = execSync(`git config --get ${key}`, {
            encoding: "utf8",
        });

        return result.trim();
    },
};

module.exports = {
    config,
};
