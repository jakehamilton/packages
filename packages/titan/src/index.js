const log = require("./util/log");
const args = require("./util/args");
const commands = require("./commands");

const main = async () => {
    if (args._.length === 0) {
        log.error("No command specified.");
        process.exit(1);
    }

    const command = args._[0];

    if (command in commands) {
        commands[command]();
    } else if (args["--help"]) {
        log.error("Root help message not implemented.");
    } else {
        log.error(`Unknown command "${command}".`);
        process.exit(1);
    }
};

main().catch((error) => {
    log.error("An unexpected error occurred:");
    log.error(error);
});
