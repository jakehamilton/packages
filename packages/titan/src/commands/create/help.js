const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    Create a new package.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan create`)} <name> [root] [options]

${kleur.bold(`OPTIONS`)}

    --help                    Show this help message
    --force, -f               Overwrite existing directory if it exists
    --name, -n                Set the name used in package.json
    --template, -t            The {white.bold starters} template to use

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Create a package named "my-library".`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan create`)} my-library

    ${kleur.dim(`$ # Create a package at "./cli/my-library".`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan create`)} my-library ./cli

    ${kleur.dim(`$ # Create a new package at "./cli/my-library".`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan create`)} --force my-library ./cli

    ${kleur.dim(`$ # Create a package named "@jakehamilton/my-package".`)}
    ${kleur.dim(`$`)} ${kleur.bold(
        `titan create`
    )} my-package --name @jakehamilton/my-package

    ${kleur.dim(`$ # Create a JavaScript library from a template.`)}
    ${kleur.dim(`$`)} ${kleur.bold(
        `titan create`
    )} my-library --template @starters/library
`;

    console.log(message);
};

module.exports = help;
