const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Remove dependencies to packages.

{bold USAGE}

    {dim $} {bold titan rm} [options] deps

{bold OPTIONS}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD

{bold EXAMPLE}

    {dim $ # Remove "react" and "redux" from all packages.}
    {dim $} {bold titan rm} react redux

    {dim $ # Remove "react" from all packages in the "@jakehamilton" namespace.}
    {dim $} {bold titan rm} --scope="^@jakehamilton" react

    {dim $ # Remove "react" from all changed packages.}
    {dim $} {bold titan rm} --changed react

    {dim $ # Remove "react" from packages with releases.}
    {dim $} {bold titan rm} --tagged react
`;

    console.log(message);
};

module.exports = help;
