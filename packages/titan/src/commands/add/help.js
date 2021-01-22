const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold("DESCRIPTION")}

    Add dependencies to packages.

${kleur.bold("USAGE")}

    ${kleur.dim(`$`)} ${kleur.bold(`titan add`)} [options] deps

${kleur.bold("OPTIONS")}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --dev, -d                 Save to devDependencies
    --peer, -p                Save to peerDependencies
    --optional, -o            Save to optionalDependencies
    --no-save, -S             Run npm with the "--no-save" option

${kleur.bold("EXAMPLE")}

    ${kleur.dim(
        `$ # Add "react" and "redux" as dependencies for all packages.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan add`)} react redux

    ${kleur.dim(
        `$ # Add "react" as a dependency for all packages in the "@jakehamilton" namespace.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan add`)} --scope="^@jakehamilton" react

    ${kleur.dim(
        `$ # Add "react" as a peer dependency for all changed packages.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan add`)} --changed --peer react

    ${kleur.dim(
        `$ # Add "react" as an optional dependency for packages with releases.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan add`)} --tagged --optional react

    ${kleur.dim(
        `$ # Add "react" and "redux" as dependencies for all packages without updating package locks.`
    )}
    ${kleur.dim(`$`)} ${kleur.bold(`titan add`)} --no-save react redux
`;

    console.log(message);
};

module.exports = help;
