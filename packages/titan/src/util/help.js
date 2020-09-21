const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Manage monorepo projects.

{bold USAGE}

    {dim $} {bold titan} <command> [options]

{bold COMMANDS}

    init                      Create a new monorepo project
    create                    Create a new package
    bootstrap                 Install and link dependencies
    version                   Generate release versions
    publish                   Publish released packages
    exec                      Execute commands on packages

{bold OPTIONS}

    --help, -h                Show this help message

{bold EXAMPLE}

    {dim $ # Get help for commands.}
    {dim $} {bold titan init} --help
    {dim $} {bold titan create} --help
    {dim $} {bold titan bootstrap} --help
    {dim $} {bold titan version} --help
    {dim $} {bold titan publish} --help
    {dim $} {bold titan exec} --help
`;

    console.log(message);
};

module.exports = help;
