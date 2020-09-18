const { execSync } = require("child_process");

const init = (root = process.cwd()) => {
    execSync("git init", {
        cwd: root,
        stdio: "pipe",
    });
};

const add = (root = process.cwd(), files = [], options = []) => {
    execSync(`git add ${files.join(" ")} ${options.join(" ")}`, {
        cwd: root,
        stdio: "pipe",
    });
};

const commit = (
    root = process.cwd(),
    message = "chore: commit",
    options = []
) => {
    execSync(`git commit -m "${message}" ${options.join(" ")}`, {
        cwd: root,
        stdio: "pipe",
    });
};

const config = {
    get(key) {
        const result = execSync(`git config --get ${key}`, {
            encoding: "utf8",
        });

        return result.trim();
    },
};

module.exports = {
    init,
    add,
    commit,
    config,
};
