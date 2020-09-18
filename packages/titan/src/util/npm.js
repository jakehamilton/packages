const { execSync } = require("child_process");

const install = (path = process.cwd(), args = []) => {
    execSync(`npm install ${args.join(" ")}`, {
        cwd: path,
        stdio: "pipe",
    });
};

module.exports = {
    install,
};
