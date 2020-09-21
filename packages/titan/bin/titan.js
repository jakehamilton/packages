#!/usr/bin/env node

try {
    require("@jakehamilton/titan");
} catch (error) {
    console.error(error);
    console.error(error.stack);
}
