import React from "react";

import { THEME_PROVIDER_CONTEXT } from "../components/ThemeProvider";

const useTheme = () => {
    const value = React.useContext(THEME_PROVIDER_CONTEXT);

    if (value === undefined) {
        const error = new Error(
            "The `useTheme` hook can only be used within a `<ThemeProvider/>`."
        );
        throw error;
    }

    return value;
};

export default useTheme;
