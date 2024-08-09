#!/usr/bin/env node

try {
    require("../src/index.js");
} catch (error) {
    console.error(error);
    console.error(error.stack);
}
