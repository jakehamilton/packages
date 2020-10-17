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
    --verbose, -v             Set logging verbosity

{bold EXAMPLE}

    {dim $ # Get help for commands.}
    {dim $} {bold titan init} --help
    {dim $} {bold titan create} --help
    {dim $} {bold titan bootstrap} --help
    {dim $} {bold titan add} --help
    {dim $} {bold titan version} --help
    {dim $} {bold titan publish} --help
    {dim $} {bold titan exec} --help
    {dim $} {bold titan changed} --help

    {dim $ # Run Titan with verbose logging.}
    {dim $} {bold titan} -v
    {dim $} {bold titan} -vv
    {dim $} {bold titan} -vvv

    {dim $ # Run Titan with no logging.}
    {dim $} LOG_LEVEL=SILENT {bold titan}
`;

    console.log(message);
};

module.exports = help;
