const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Install and link dependencies.

{bold USAGE}

    {dim $} {bold titan bootstrap} [options]

{bold OPTIONS}

    --help, -h                Show this help message

{bold EXAMPLE}

    {dim $ # Install and link all dependencies}
    {dim $} {bold titan bootstrap}
`;

    console.log(message);
};

module.exports = help;
