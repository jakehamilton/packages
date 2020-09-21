const chalk = require("chalk");

const help = () => {
    const message = chalk`
{bold DESCRIPTION}

    Run a shell command in each package.

{bold USAGE}

    {dim $} {bold titan exec} [options] -- <command>

{bold OPTIONS}

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD

{bold EXAMPLE}

    {dim $ # Build only packages in the "@jakehamilton" namespace.}
    {dim $} {bold titan exec} --scope="^@jakehamilton" -- npm run build

    {dim $ # Build all packages that have changed since release.}
    {dim $} {bold titan exec} --changed -- npm run build

    {dim $ # Build all packages that are tagged for release.}
    {dim $} {bold titan exec} --tagged -- npm run build
`;

    console.log(message);
};

module.exports = help;
