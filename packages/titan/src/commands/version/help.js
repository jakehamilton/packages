const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Version packages.

{bold USAGE}

    {dim $} {bold titan publish} [options]

{bold OPTIONS}

    --help, -h                Show this help message

{bold EXAMPLE}

    {dim $ # Version packages.}
    {dim $} {bold titan version}
`;

    console.log(message);
};

module.exports = help;
