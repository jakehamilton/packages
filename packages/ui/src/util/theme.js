import tinycolor from "tinycolor2";
import { glob } from "goober";

export const isValidMode = (mode) => mode === "light" || mode === "dark";

export const DEFAULT_PADDING = 8;

export const DEFAULT_LIGHT_THEME = {
    padding: DEFAULT_PADDING,
    shadows: {
        1: "5px 5px 10px #ebebeb, -5px -5px 10px #ffffff",
        2: "7px 7px 14px #ebebeb, -7px -7px 14px #ffffff",
        3: "9px 9px 18px #dcdcdc, -9px -9px 18px #ffffff",
        4: "13px 13px 26px #d4d4d4, -13px -13px 26px #ffffff",
        5: "20px 20px 40px #bcbcbc, -20px -20px 40px #ffffff",
    },
    primary: {
        main: "#842dbf",
        light: "#a85fd9",
        dark: "#842dbf",
        text: "#ffffff",
    },
    secondary: {
        main: "#ecb33a",
        light: "#f3ce80",
        dark: "#ecb33a",
        text: "#ffffff",
    },
    text: {
        main: "#333333",
        light: "#808080",
        dark: "#404040",
    },
    background: {
        main: "#ededed",
        light: "#ffffff",
        dark: "#dfdfdf",
    },
};

export const DEFAULT_DARK_THEME = {
    padding: DEFAULT_PADDING,
    shadows: {
        1: "5px 5px 10px #ebebeb, -5px -5px 10px #ffffff",
        2: "7px 7px 14px #ebebeb, -7px -7px 14px #ffffff",
        3: "9px 9px 18px #dcdcdc, -9px -9px 18px #ffffff",
        4: "13px 13px 26px #d4d4d4, -13px -13px 26px #ffffff",
        5: "20px 20px 40px #bcbcbc, -20px -20px 40px #ffffff",
    },
    primary: {
        main: "#842dbf",
        light: "#a85fd9",
        dark: "#842dbf",
        text: "#ffffff",
    },
    secondary: {
        main: "#ecb33a",
        light: "#f3ce80",
        dark: "#ecb33a",
        text: "#ffffff",
    },
    text: {
        main: "#efefef",
        light: "#ffffff",
        dark: "#c9c9c9",
    },
    background: {
        main: "#222222",
        light: "#3b3b3b",
        dark: "#080808",
    },
};

export const normalizeColor = (color, lighten = 10, darken = 10) => {
    if (!color.light) {
        color.light = tinycolor(color.main).lighten(lighten).toString();
    }

    if (!color.dark) {
        color.dark = tinycolor(color.main).darken(darken).toString();
    }

    if (!color.text) {
        color.text = "#ffffff";
    }

    return color;
};

export const normalizePalette = (palette, defaults) => {
    if (!palette.primary || !palette.primary.main) {
        throw new Error("Palette does not have a primary color.");
    }

    if (!palette.secondary || !palette.secondary.main) {
        throw new Error("Palette does not have a secondary color.");
    }

    const padding = palette.padding || DEFAULT_PADDING;
    const primary = normalizeColor(palette.primary);
    const secondary = normalizeColor(palette.secondary);
    const text = normalizeColor(palette.text || defaults.text, 30, 15);
    const background = normalizeColor(
        palette.background || defaults.background
    );

    return {
        padding,
        primary,
        secondary,
        text,
        background,
    };
};

export const normalizePalettes = (palettes) => {
    const light = palettes.light
        ? normalizePalette(palettes.light, DEFAULT_LIGHT_THEME)
        : DEFAULT_LIGHT_THEME;
    const dark = palettes.dark
        ? normalizePalette(palettes.dark, DEFAULT_DARK_THEME)
        : DEFAULT_DARK_THEME;

    return {
        light,
        dark,
    };
};

export const injectGlobalStyles = () => {
    glob`
        *, *:before, *:after {
            box-sizing: border-box;
        }

        html {
            font-size: 16px;
            font-family: Inter, Arial, sans-serif;
        }

        html,
        body,
        #root {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        p,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            margin: 0;
        }
    `;
};
