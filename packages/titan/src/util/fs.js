const fs = require("fs");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
const { promisify } = require("util");

const exists = (path) => {
    return fs.existsSync(path);
};

const mkdir = (path) => {
    mkdirp.sync(path);
};

const isDir = (path) => {
    const stats = fs.statSync(path);
    return stats.isDirectory();
};

const readDir = (path, options) => {
    const result = fs.readdirSync(path, options);
    return result;
};

const readDirAsync = promisify(fs.readdir);

const rm = (path) => {
    rimraf.sync(path);
};

const write = (path, data, options) => {
    fs.writeFileSync(path, data, options);
};

const read = (path, options) => {
    return fs.readFileSync(path, options);
};

const touch = (path) => {
    fs.writeFileSync(path, "");
};

const link = (from, to, type = "dir") => {
    fs.symlinkSync(from, to, type);
};

const stat = promisify(fs.stat);

const readFile = promisify(fs.readFile);

module.exports = {
    ...fs,
    rm,
    exists,
    mkdir,
    isDir,
    readDir,
    read,
    write,
    touch,
    link,
    stat,
    readFile,
    readDirAsync,
};
