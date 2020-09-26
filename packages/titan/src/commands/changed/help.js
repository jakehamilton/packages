const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    List changed packages since the last release.

{bold USAGE}

    {dim $} {bold titan changed}

{bold OPTIONS}

    --help, -h                Show this help message

{bold EXAMPLE}

    {dim $} {bold titan changed}
`;

    console.log(message);
};

module.exports = help;
