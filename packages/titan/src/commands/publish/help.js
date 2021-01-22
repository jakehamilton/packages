const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    Publish packages that have release tags.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan publish`)} [options]

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --dry-run, -d             Don't publish packages, only print versions.

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Publish packages.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan publish`)}

    ${kleur.dim(`$ # View actions that would be taken if we published.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan publish`)} --dry-run
`;

    console.log(message);
};

module.exports = help;
