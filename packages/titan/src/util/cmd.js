const childProcess = require("child_process");
const { promisify } = require("util");

const exec = (command, options) => {
    return childProcess.execSync(command, options);
};

const execAsync = promisify(childProcess.exec);

const spawnAsync = childProcess.spawn;

module.exports = {
    exec,
    execAsync,
    spawnAsync,
};
