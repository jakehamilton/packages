const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    Manage monorepo projects.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan`)} <command> [options]

${kleur.bold(`COMMANDS`)}

    init                      Create a new monorepo project
    create                    Create a new package
    bootstrap                 Install and link dependencies
    version                   Generate release versions
    publish                   Publish released packages
    exec                      Execute commands on packages

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --verbose, -v             Set logging verbosity

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Get help for commands.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan init`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan create`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan bootstrap`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan add`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan rm`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan version`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan publish`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan exec`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan changed`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`titan run`)} --help

    ${kleur.dim(`$ # Run Titan with verbose logging.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan`)} -v
    ${kleur.dim(`$`)} ${kleur.bold(`titan`)} -vv
    ${kleur.dim(`$`)} ${kleur.bold(`titan`)} -vvv

    ${kleur.dim(`$ # Run Titan with no logging.`)}
    ${kleur.dim(`$`)} LOG_LEVEL=SILENT ${kleur.bold(`titan`)}
`;

    console.log(message);
};

module.exports = help;
