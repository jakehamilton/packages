const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    Remove dependencies to packages.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan rm`)} [options] deps

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --no-save, -S             Run npm with the "--no-save" option

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Remove "react" and "redux" from all packages.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan rm`)} react redux

    ${kleur.dim(
        `$ # Remove "react" from all packages in the "@jakehamilton" namespace.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan rm`)} --scope="^@jakehamilton" react

    ${kleur.dim(`$ # Remove "react" from all changed packages.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan rm`)} --changed react

    ${kleur.dim(`$ # Remove "react" from packages with releases.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan rm`)} --tagged react

    ${kleur.dim(
        `$ # Remove "react" and "redux" as dependencies for all packages without updating package locks.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan add`)} --no-save react redux
`;

    console.log(message);
};

module.exports = help;
