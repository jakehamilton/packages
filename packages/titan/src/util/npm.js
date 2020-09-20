const { execSync } = require("child_process");

const install = (path = process.cwd(), args = []) => {
    execSync(`npm install ${args.join(" ")}`, {
        cwd: path,
        stdio: "pipe",
    });
};

const parseNameWithVersion = (name) => {
    const match = /(?<name>@?.+)@(?<version>.+)/.exec(name);

    if (match) {
        return {
            name: match.groups.name,
            version: match.groups.version,
        };
    } else {
        throw new Error(`Unable to parse package name with version "${name}".`);
    }
};

module.exports = {
    install,
    parseNameWithVersion,
};
