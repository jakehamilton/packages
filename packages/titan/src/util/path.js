const path = require("path");

const isPath = (input) => {
    return input !== path.basename(input);
};

const resolveRelative = (input, root = process.cwd()) => {
    if (path.isAbsolute(input)) {
        return input;
    } else {
        return path.resolve(root, input);
    }
};

module.exports = {
    ...path,
    isPath,
    resolveRelative,
};
