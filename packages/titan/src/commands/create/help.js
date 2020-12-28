const chalk = require("chalk");

const help = () => {
    const message = chalk`
    {bold DESCRIPTION}

        Create a new package.

    {bold USAGE}

        {dim $} {bold titan create} <name> [root] [options]

    {bold OPTIONS}

        --help                    Show this help message
        --force, -f               Overwrite existing directory if it exists
        --name, -n                Set the name used in package.json
        --template, -t            The {white.bold starters} template to use

    {bold EXAMPLE}

        {dim $ # Create a package named "my-library".}
        {dim $} {bold titan create} my-library

        {dim $ # Create a package at "./cli/my-library".}
        {dim $} {bold titan create} my-library ./cli

        {dim $ # Create a new package at "./cli/my-library".}
        {dim $} {bold titan create} --force my-library ./cli

        {dim $ # Create a private package.}
        {dim $} {bold titan create} --private my-private-library

        {dim $ # Create a JavaScript library from a template.}
        {dim $} {bold titan create} my-library --template @starters/library
`;

    console.log(message);
};

module.exports = help;
