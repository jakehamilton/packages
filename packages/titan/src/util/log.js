const littlelog = require("@littlethings/log");
const args = require("./args");

if (args["--verbose"]) {
    switch (args["--verbose"]) {
        default:
        case 0:
            break;
        case 1:
            littlelog.setVerbosity("INFO");
            break;
        case 2:
            littlelog.setVerbosity("DEBUG");
            break;
        case 3:
            littlelog.setVerbosity("TRACE");
            break;
    }

    if (args["--verbose"] > 3) {
        littlelog.setVerbosity("TRACE");
    }
}

module.exports = littlelog.create("Titan");
