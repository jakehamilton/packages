const chalk = require("chalk");

const help = () => {
    const message = chalk`
    {bold DESCRIPTION}

        Create a new package.

    {bold USAGE}

        {dim $} {bold titan create} <name> [root]

    {bold OPTIONS}

        --help                    Show this help message
        --force, -f               Overwrite existing directory if it exists
        --private, -p             Set the package to private

    {bold EXAMPLE}

        {dim $ # Create a package at "./cli/my-library".}
        {dim $} {bold titan create} my-library ./cli

        {dim $ # Create a new package at "./cli/my-library".}
        {dim $} {bold titan create} --force my-library ./cli

        {dim $ # Create a private package.}
        {dim $} {bold titan create} --private my-private-library
`;

    console.log(message);
};

module.exports = help;
