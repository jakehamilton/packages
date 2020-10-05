import React from "react";
import PropTypes from "prop-types";
import { glob } from "goober";

import { noop } from "../../util/misc";
import {
    isValidMode,
    normalizePalettes,
    DEFAULT_LIGHT_THEME,
    DEFAULT_DARK_THEME,
} from "../../util/theme";

export const DEFAULT_MODE = "light";
export const DEFAULT_THEME = {};

export const THEME_MODE_LOCAL_STORAGE_KEY = "ui/theme/mode";

export const THEME_PROVIDER_CONTEXT = React.createContext({
    theme: DEFAULT_LIGHT_THEME,
    palettes: {
        light: DEFAULT_LIGHT_THEME,
        dark: DEFAULT_DARK_THEME,
    },
    setMode: noop,
});

export const ThemeProvider = ({
    palettes = {},
    mode = DEFAULT_MODE,
    children,
}) => {
    const [currentMode, setCurrentMode] = React.useState(mode);

    React.useEffect(() => {
        const saved = localStorage.getItem(THEME_MODE_LOCAL_STORAGE_KEY);

        if (isValidMode(saved)) {
            setCurrentMode(saved);
        }
    }, []);

    React.useEffect(() => {
        if (isValidMode(currentMode)) {
            localStorage.setItem(THEME_MODE_LOCAL_STORAGE_KEY, currentMode);
        }
    }, [currentMode]);

    const normalizedPalettes = React.useMemo(() => {
        const normalizedPalettes = normalizePalettes(palettes);
        return normalizedPalettes;
    }, [palettes]);

    const pad = React.useCallback(
        (level) => {
            return normalizedPalettes[currentMode].padding * level;
        },
        [currentMode, normalizedPalettes]
    );

    const shadow = React.useCallback(
        (level) => {
            if (
                level === 0 ||
                !normalizedPalettes[currentMode].shadows[level]
            ) {
                return "none";
            } else {
                return normalizedPalettes[currentMode].shadows[level];
            }
        },
        [currentMode, normalizedPalettes]
    );

    return (
        <THEME_PROVIDER_CONTEXT.Provider
            value={{
                theme: normalizedPalettes[currentMode],
                palettes: normalizedPalettes,
                setMode: setCurrentMode,
                pad,
                shadow,
            }}
        >
            {children}
        </THEME_PROVIDER_CONTEXT.Provider>
    );
};

const PALETTE_PROP_TYPE = PropTypes.shape({
    padding: PropTypes.number,
    primary: PropTypes.shape({
        main: PropTypes.string.isRequired,
        light: PropTypes.string,
        dark: PropTypes.string,
        text: PropTypes.string,
    }).isRequired,
    secondary: PropTypes.shape({
        main: PropTypes.string.isRequired,
        light: PropTypes.string,
        dark: PropTypes.string,
        text: PropTypes.string,
    }).isRequired,
});

ThemeProvider.propTypes = {
    mode: PropTypes.oneOf(["light", "dark"]),
    palettes: PropTypes.shape({
        light: PALETTE_PROP_TYPE,
        dark: PALETTE_PROP_TYPE,
    }),
};

export default ThemeProvider;
