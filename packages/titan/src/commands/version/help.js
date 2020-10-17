const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Version packages.

{bold USAGE}

    {dim $} {bold titan publish} [options]

{bold OPTIONS}

    --help, -h                Show this help message
    --dry-run, -d             Don't change versions, only print changes.

{bold EXAMPLE}

    {dim $ # Version packages.}
    {dim $} {bold titan version}

    {dim $ # View actions that would be taken if we versioned.}
    {dim $} {bold titan version} --dry-run
`;

    console.log(message);
};

module.exports = help;
