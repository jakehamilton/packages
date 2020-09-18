const chalk = require("chalk");

const help = () => {
    const message = chalk`
    {bold USAGE}

        {dim $} {bold titan create} <name> [<where>]

    {bold OPTIONS}
        --help                Show this help message

    {bold EXAMPLE}

        {dim $} {bold titan create} my-library ./cli
`;

    console.log(message);
};

module.exports = help;
