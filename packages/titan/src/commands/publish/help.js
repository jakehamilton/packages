const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Publish packages that have release tags.

{bold USAGE}

    {dim $} {bold titan publish} [options]

{bold OPTIONS}

    --help, -h                Show this help message
    --dry-run, -d             Don't publish packages, only print versions.

{bold EXAMPLE}

    {dim $ # Publish packages.}
    {dim $} {bold titan publish}

    {dim $ # View actions that would be taken if we published.}
    {dim $} {bold titan publish} --dry-run
`;

    console.log(message);
};

module.exports = help;
