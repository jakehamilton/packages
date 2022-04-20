const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    Update package metadata.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan update-metadata`)} [options]

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Update all package metadata.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan update-metadata`)}

    ${kleur.dim(`$ # Update metadata for my-package.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan update-metadata --scope my-package`)}
`;

    console.log(message);
};

module.exports = help;
