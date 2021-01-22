const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    Create a new project managed by Titan.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan init`)} [options] <name>

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --name, -n                Set the name of the project for package.json
    --force, -f               Overwrite existing directory
    --skip-install, -x        Skip installing dependencies
    --skip-git, -X            Skip running git commands
    --template, -t            The {white.bold starters} template to use

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Create a new project.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan init`)} my-project

    ${kleur.dim(`$ # Create a new project and overwrite an existing one.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan init`)} --force my-project

    ${kleur.dim(`$ # Create a new project but don't install dependencies.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan init`)} --skip-install my-project

    ${kleur.dim(`$ # Create a new project but don't run git commands.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan init`)} --skip-git my-project

    ${kleur.dim(`$ # Create a new project using a template.`)}
    ${kleur.dim(`$`)} ${kleur.bold(
        `titan init`
    )} my-project --template my-starters-template
`;

    console.log(message);
};

module.exports = help;
