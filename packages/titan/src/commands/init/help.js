const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Create a new project managed by Titan.

{bold USAGE}

    {dim $} {bold titan init} [options] <name>

{bold OPTIONS}

    --help, -h                Show this help message
    --name, -n                Set the name of the project for package.json
    --force, -f               Overwrite existing directory
    --skip-install, -x        Skip installing dependencies
    --skip-git, -X            Skip running git commands

{bold EXAMPLE}

    {dim $ # Create a new project.}
    {dim $} {bold titan init} my-project

    {dim $ # Create a new project and overwrite an existing one.}
    {dim $} {bold titan init} --force my-project

    {dim $ # Create a new project but don't install dependencies.}
    {dim $} {bold titan init} --skip-install my-project

    {dim $ # Create a new project but don't run git commands.}
    {dim $} {bold titan init} --skip-git my-project
`;

    console.log(message);
};

module.exports = help;
