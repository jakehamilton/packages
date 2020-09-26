const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Add dependencies to packages.

{bold USAGE}

    {dim $} {bold titan add} [options] deps

{bold OPTIONS}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --dev, -d                 Save to devDependencies
    --peer, -p                Save to peerDependencies
    --optional, -o            Save to optionalDependencies

{bold EXAMPLE}

    {dim $ # Add "react" as a dependency for all packages in the "@jakehamilton" namespace.}
    {dim $} {bold titan add} --scope="^@jakehamilton" react

    {dim $ # Add "react" as a peer dependency for all changed packages.}
    {dim $} {bold titan add} --changed --peer react

    {dim $ # Add "react" as an optional dependency for packages with releases.}
    {dim $} {bold titan add} --tagged --optional react
`;

    console.log(message);
};

module.exports = help;
