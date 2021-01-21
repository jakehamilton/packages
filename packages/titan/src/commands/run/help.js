const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Run a shell command in each package.

{bold USAGE}

    {dim $} {bold titan run} <name> [options] -- [script-options]

{bold OPTIONS}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --ordered, -o             Run scripts for packages in order of dependencies

{bold EXAMPLE}

    {dim $ # Build all packages.}
    {dim $} {bold titan run} build

    {dim $ # Build only packages in the "@jakehamilton" namespace.}
    {dim $} {bold titan run} build --scope="^@jakehamilton"

    {dim $ # Build all packages that have changed since release.}
    {dim $} {bold titan run} build --changed

    {dim $ # Build all packages that are tagged for release.}
    {dim $} {bold titan run} build --tagged

    {dim $ # Build all packages in order of dependencies.}
    {dim $} {bold titan run} build --ordered
`;

    console.log(message);
};

module.exports = help;
