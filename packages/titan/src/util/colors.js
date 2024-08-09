const kleur = require("kleur");

const foreground = [
    "magenta",
    "cyan",
    "white",
    "yellow",
    "blue",
    "red",
    "green",
    "gray",
];

const background = [
    "transparent",
    "bgBlack",
    "bgWhite",
    "bgBlue",
    "bgMagenta",
    "bgCyan",
    "bgRed",
    "bgGreen",
    "bgYellow",
];

let uniqueForeground = 0;
let uniqueBackground = 0;

const unique = () => {
    const fg = foreground[uniqueForeground];
    const bg = background[uniqueBackground];

    let color = bg === "transparent" ? kleur[fg] : kleur[fg]()[bg];

    uniqueForeground++;

    if (uniqueForeground > foreground.length - 1) {
        uniqueBackground++;
        uniqueForeground = 0;
    }

    if (uniqueBackground > background.length - 1) {
        uniqueBackground = 0;
        uniqueForeground = 0;
    }

    return color;
};

module.exports = {
    foreground,
    background,
    unique,
};
