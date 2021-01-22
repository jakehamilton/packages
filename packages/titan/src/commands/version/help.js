const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    Version packages.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan publish`)} [options]

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --dry-run, -d             Don't change versions, only print changes.

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Version packages.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan version`)}

    ${kleur.dim(`$ # View actions that would be taken if we versioned.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan version`)} --dry-run
`;

    console.log(message);
};

module.exports = help;
