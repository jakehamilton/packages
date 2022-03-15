# @jakehamilton/titan

> Manage monorepo projects.

## Installation

```shell
npm install --global @jakehamilton/titan
```

## Usage

```shell
# Print help message.
titan --help
```

```
USAGE

    $ titan <command> [options]

COMMANDS

    init                      Create a new monorepo project
    create                    Create a new package
    install                   Install and link dependencies
    add                       Add one or more dependencies
    rm                        Remove one or more dependencies
    version                   Generate release versions
    publish                   Publish released packages
    changed                   List changed packages since the last release
    exec                      Execute commands on packages
    run                       Run a shell command in each package

OPTIONS

    --help, -h                Show this help message
    --verbose, -v             Set logging verbosity

EXAMPLE

    $ # Get help for commands.
    $ titan init --help
    $ titan create --help
    $ titan install --help
    $ titan add --help
    $ titan rm --help
    $ titan version --help
    $ titan publish --help
    $ titan changed --help
    $ titan exec --help
    $ titan run --help

    $ # Run Titan with verbose logging.
    $ titan -v
    $ titan -vv
    $ titan -vvv

    $ # Run Titan with no logging.
    $ LOG_LEVEL=SILENT titan

    $ # Run Titan with timestamps.
    $ LOG_TIMESTAMP=TRUE titan

    $ # Filter logs from Titan (based on log prefix).
    $ DEBUG="^some-regex$" titan
```

## Before You Start

Titan relies on a few other projects to implement its functionality. A
lot of the logic lives inside Titan itself, but we found easier to
manage if certain parts were separated. Here are the libraries that
Titan makes use of under the hood.

-   [@littlethings/log](https://npm.im/@littlethings/log)
-   [@starters/core](https://npm.im/@starters/core)

Of particular note is `@littlethings/log` which can be configured with
environment variables like `DEBUG` to modify how Titan logs things.

Titan also uses `@starters/core` to enable customizable boilerplate
templating to help you get started even faster. Both `titan init` and
`titan create` support using starter templates.

## Initialize A New Project

Titan allows you to quickly start a new monorepo project.

```shell
# For help with the `init` command.
titan init --help
```

```
USAGE

    $ titan init [options] <name>

OPTIONS

    --help, -h                Show this help message
    --name, -n                Set the name of the project for package.json
    --force, -f               Overwrite existing directory
    --skip-install, -x        Skip installing dependencies
    --skip-git, -X            Skip running git commands
    --template, -t            The {white.bold starters} template to use

EXAMPLE

    $ # Create a new project.
    $ titan init my-project

    $ # Create a new project and overwrite an existing one.
    $ titan init --force my-project

    $ # Create a new project but don't install dependencies.
    $ titan init --skip-install my-project

    $ # Create a new project but don't run git commands.
    $ titan init --skip-git my-project

    $ # Create a new project using a template.
    $ titan init my-project --template my-starters-template
```

Let's start a new project named `my-project`.

```shell
titan init my-project
```

Titan will create a new directory named `my-project` and set it up for
you to start working. Once that's done, you can enter the `my-project`
directory and create your first package.

## Creating A Package

Titan lets you easily create new packages for your project.

```shell
# For help with the `create` command.
titan create --help
```

```
USAGE

    $ titan create <name> [root] [options]

OPTIONS

    --help                    Show this help message
    --force, -f               Overwrite existing directory if it exists
    --name, -n                Set the name used in package.json
    --template, -t            The {white.bold starters} template to use

EXAMPLE

    $ # Create a package named "my-library".
    $ titan create my-library

    $ # Create a package at "./cli/my-library".
    $ titan create my-library ./cli

    $ # Create a new package at "./cli/my-library".
    $ titan create --force my-library ./cli

    $ # Create a package named "@jakehamilton/my-package".
    $ titan create my-package --name @jakehamilton/my-package

    $ # Create a JavaScript library from a template.
    $ titan create my-library --template @starters/library
```

Now, let's create a new package named `my-cool-library`.

```shell
titan create my-cool-library
```

When you run `titan create`, Titan will make a new directory under
`packages/` with your package's name. By default, Titan will use the
[@starters/empty](https://github.com/jakehamilton/starter-empty-template) template. If you want to choose a different template
for your package, you can use the `--template` option.

## Install Dependencies

Titan can manage npm dependencies and intelligently link local ones.

```shell
# For help with the `add` command.
titan add --help
```

```
USAGE

    $ titan add [options] deps

OPTIONS

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --dev, -d                 Save to devDependencies
    --peer, -p                Save to peerDependencies
    --optional, -o            Save to optionalDependencies
    --no-save, -S             Run npm with the "--no-save" option

EXAMPLE

    $ # Add "react" and "redux" as dependencies for all packages.
    $ titan add react redux

    $ # Add "react" as a dependency for all packages in the "@jakehamilton" namespace.
    $ titan add --scope="^@jakehamilton" react

    $ # Add "react" as a peer dependency for all changed packages.
    $ titan add --changed --peer react

    $ # Add "react" as an optional dependency for packages with releases.
    $ titan add --tagged --optional react

    $ # Add "react" and "redux" as dependencies for all packages without updating package locks.
    $ titan add --no-save react redux
```

Let's add `react` as a dependency of our `my-cool-library` package. We
will use the `--scope` option to make sure Titan only installs this
dependency for `my-cool-library`. By default, Titan will add dependencies
to every package in your project.

```shell
titan add --scope=my-cool-library react
```

The `--scope` option takes a JavaScript RegEx, so you can get fancy
in how you target packages for dependency installation.

## Running Scripts

Titan gives you flexibility in how you run npm scripts or arbitrary
shell commands for your packages. This is often used in automated
CI systems, but can also be helpful when you want to perform an
action on one or many of your packages from the command line.

We can use the `run` command to run npm scripts in packages.

```shell
# For help with the `run` command.
titan run --help
```

```
USAGE

    $ titan run <name> [options] -- [script-options]

OPTIONS

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --ordered, -o             Run scripts for packages in order of dependencies
    --cache, -C               Only run for packages that aren't cached

EXAMPLE

    $ # Build all packages.
    $ titan run build

    $ # Build only packages in the "@jakehamilton" namespace.
    $ titan run build --scope="^@jakehamilton"

    $ # Build all packages that have changed since release.
    $ titan run build --changed

    $ # Build all packages that are tagged for release.
    $ titan run build --tagged

    $ # Build all packages in order of dependencies.
    $ titan run build --ordered

    $ # Build only packages that have been modified since the last build.
    $ titan run build --cache
```

Let's run the `build` npm script for our packages.

**NOTE**: If a package does not have a script matching the one we
want to execute, that package will be skipped.

```shell
titan run build
```

Great! That will build our packages. In case we want to run various
shell commands on our packages, we can use the `exec` command.

```shell
# For help with the `exec` command.
titan exec --help
```

```
USAGE

    $ titan exec [options] -- <command>

OPTIONS

    --help, -h                Show this help message
    --scope, -s               Set the scope regex to match against
    --changed, -c             Only run for packages that have changed
    --tagged, -t              Only run for packages that are tagged on HEAD
    --ordered, -o             Run command for packages in order of dependencies
    --cache, -C               Only execute command for packages that aren't cached

EXAMPLE

    $ # Build all packages.
    $ titan exec -- npm run build

    $ # Build only packages in the "@jakehamilton" namespace.
    $ titan exec --scope="^@jakehamilton" -- npm run build

    $ # Build all packages that have changed since release.
    $ titan exec --changed -- npm run build

    $ # Build all packages that are tagged for release.
    $ titan exec --tagged -- npm run build

    $ # Build all packages in order of dependencies.
    $ titan exec --ordered -- npm run build

    $ # Build only packages that have been modified since the last build
    $ titan exec --cache -- npm run build
```

Let's run `ls` on our packages to see the built files inside each
package's `dist/` directory.

```shell
titan exec -- ls dist
```

Titan executes `ls dist` inside each package. This is also useful for
other arbitrary tasks that wouldn't fit inside an npm script.

## Version Packages

Once you've worked on a package and committed your changes with Git,
you can use Titan to tag versions and generate a changelog.

**NOTE**: This process is typically done automatically in a CI like
GitHub Actions. See the [CI Configuration](https://github.com/jakehamilton/packages/blob/main/.github/workflows/version.yaml)
we use for Titan for reference.

```shell
# For help with the `version` command.
titan version --help
```

```
USAGE

    $ titan publish [options]

OPTIONS

    --help, -h                Show this help message
    --dry-run, -d             Don't change versions, only print changes.

EXAMPLE

    $ # Version packages.
    $ titan version

    $ # View actions that would be taken if we versioned.
    $ titan version --dry-run
```

Before versioning packages, you can check to see what has changed
by running the `changed` command.

```shell
# For help with the `changed` command.
titan changed --help
```

```
USAGE

    $ titan changed

OPTIONS

    --help, -h                Show this help message

EXAMPLE

    $ titan changed
```

Let's start by checking to see what packages have been changed in
our repository.

```shell
titan changed
```

Titan will list out the changed packages like this:

```
[Titan][INFO] Package my-cool-library has 1 change since version "1.0.0".
```

Then, we can version our packages with the `version` command.

```shell
titan version
```

This will update the `package.json`, add tags in Git, and generate
a file `CHANGELOG.md` for each package.

## Publishing Packages

Once your packages have been versioned, Titan can publish them to npm!

```shell
# For help with the `publish` command.
titan publish --help
```

```
USAGE

    $ titan publish [options]

OPTIONS

    --help, -h                Show this help message
    --dry-run, -d             Don't publish packages, only print versions.

EXAMPLE

    $ # Publish packages.
    $ titan publish

    $ # View actions that would be taken if we published.
    $ titan publish --dry-run
```

To publish our packages, they need to have been versioned by Titan. This
means that the current Git commit _must_ have a release tag. If you ran
`titan version` then this is taken care of for you. To release, we can
simply run the `publish` command.

```shell
titan publish
```

In case you don't want to release just yet, but would like to
know which packages Titan would publish, then you can use the `--dry-run`
option.

```shell
titan publish --dry-run
```

This will print out a result like this:

```
[Titan][INFO] Executing dry run.
[Titan][INFO] Publish package "my-cool-library" at version "1.1.0".
```

## Package Configuration

Titan uses a special `titan` property in `package.json` files to let
you configure certain use cases.

### Titan Projects

For a directory to be a Titan project, it must have a `package.json` file
with `titan` configuration on it:

```json
{
    "titan": {
        "packages": ["./packages"]
    }
}
```

In a project's configuration, you can specify an array of directories
that contain packages. The default value used above tells Titan that
our code lives in folders under a directory named `packages`. So if
we created a new library, it would be located in
`./packages/my-cool-library`.

You can specify multiple directories here to support any organizational
structure you need for your project. For example, if you wanted to split
your packages into separate directories named `cli`, `core`, and `lib`:

```json
{
    "titan": {
        "packages": ["./cli", "./core", "./lib"]
    }
}
```

### Titan Packages

For individual packages, you can configure titan features in the same
way:

```json
{
    "titan": {
        "artifacts": ["./dist"]
    }
}
```

Individual packages can configure `artifacts` which Titan inspects when
using the `run` or `exec` commands with the `--cache` option. This can
be a great way to speed up development by avoiding building packages
that haven't changed. Under the hood Titan hashes files at the paths
given in the `artifacts` array. This information is then referenced each
time Titan needs to run a task on packages. If the package's artifacts
have not changed, Titan will skip the package and move on to the next
one.
