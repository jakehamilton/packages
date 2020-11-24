const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Install and link dependencies.

{bold USAGE}

    {dim $} {bold titan bootstrap} [options]

{bold OPTIONS}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --no-save, -S             Run npm with the "--no-save" option

{bold EXAMPLE}

    {dim $ # Install and link all dependencies}
    {dim $} {bold titan bootstrap}

    {dim $ # Install dependencies for all packages in the "@jakehamilton" namespace.}
    {dim $} {bold titan bootstrap} --scope="^@jakeahmilton"

    {dim $ # Install dependencies for all changed packages.}
    {dim $} {bold titan bootstrap} --changed

    {dim $ # Install dependencies for packages with releases.}
    {dim $} {bold titan bootstrap} --tagged

    {dim $ # Install dependencies but don't modify "package-lock.json" files.}
    {dim $} {bold titan bootstrap} --no-save
`;

    console.log(message);
};

module.exports = help;
