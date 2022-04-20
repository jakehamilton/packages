const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold(`DESCRIPTION`)}

    Install and link dependencies.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`titan install`)} [options]

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --no-save, -S             Run npm with the "--no-save" option
    --with-deps, -d           Also run for packages that depend on the target

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Install and link all dependencies`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan install`)}

    ${kleur.dim(
        `$ # Install dependencies for all packages in the "@jakehamilton" namespace.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan install`)} --scope="^@jakeahmilton"

    ${kleur.dim(`$ # Install dependencies for all changed packages.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan install`)} --changed

    ${kleur.dim(`$ # Install dependencies for packages with releases.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`titan install`)} --tagged

    ${kleur.dim(
        `$ # Install dependencies but don't modify "package-lock.json" files.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan install`)} --no-save

    ${kleur.dim(
        `$ # Install dependencies for "my-package" and all packages that depend on it.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(
        `titan install`
    )} --with-deps --scope my-package
`;

    console.log(message);
};

module.exports = help;
