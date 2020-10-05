import React from "react";

import Gap from "../Gap";
import ColorSwatch from "../ColorSwatch";
import useTheme from "../../hooks/useTheme";

import { ThemeProvider } from ".";

export default {
    title: "Utility/ThemeProvider",
    component: ThemeProvider,
};

const Template = (args) => <ThemeProvider {...args} />;

const ThemeDisplay = () => {
    const { theme } = useTheme();

    return (
        <div>
            <ColorSwatch
                label="Primary"
                color={theme.primary.main}
                format="inline"
            />
            <Gap vertical />
            <ColorSwatch
                label="Primary (light)"
                color={theme.primary.light}
                format="inline"
            />
            <Gap vertical />
            <ColorSwatch
                label="Primary (dark)"
                color={theme.primary.dark}
                format="inline"
            />
            <Gap vertical />
            <ColorSwatch
                label="Secondary"
                color={theme.secondary.main}
                format="inline"
            />
            <Gap vertical />
            <ColorSwatch
                label="Secondary (light)"
                color={theme.secondary.light}
                format="inline"
            />
            <Gap vertical />
            <ColorSwatch
                label="Secondary (dark)"
                color={theme.secondary.dark}
                format="inline"
            />
            <Gap vertical />
            <ColorSwatch label="Text" color={theme.text.main} format="inline" />
            <Gap vertical />
            <ColorSwatch
                label="Text (light)"
                color={theme.text.light}
                format="inline"
            />
            <Gap vertical />
            <ColorSwatch
                label="Text (dark)"
                color={theme.text.dark}
                format="inline"
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    palettes: {
        light: {
            primary: {
                main: "#842dbf",
            },
            secondary: {
                main: "#ecb33a",
            },
            text: {
                main: "#333333",
            },
        },
    },
    children: <ThemeDisplay />,
};
