const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    List changed packages since the last release.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan changed`)}

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan changed`)}
`;

    console.log(message);
};

module.exports = help;
