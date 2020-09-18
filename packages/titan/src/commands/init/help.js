const chalk = require("chalk");

const help = () => {
    const message = chalk`
    {bold USAGE}

        {dim $} {bold titan init} <name>

    {bold OPTIONS}
        --help                Show this help message

    {bold EXAMPLE}

        {dim $} {bold titan init} my-project
`;

    console.log(message);
};

module.exports = help;
