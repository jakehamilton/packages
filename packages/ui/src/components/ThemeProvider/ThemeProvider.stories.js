import React from "react";

import Gap from "../Gap";
import ColorSwatch from "../ColorSwatch";
import useTheme from "../../hooks/useTheme";

import { ThemeProvider } from ".";
import Block from "../Block";

export default {
    title: "Utility/ThemeProvider",
    component: ThemeProvider,
};

const SwatchesForColor = ({ label, color }) => {
    return (
        <React.Fragment>
            <ColorSwatch label={label} color={color.main} format="inline" />
            <Gap vertical />
            <ColorSwatch
                label={`${label} (light)`}
                color={color.light}
                format="inline"
            />
            <Gap vertical />
            <ColorSwatch
                label={`${label} (dark)`}
                color={color.dark}
                format="inline"
            />
        </React.Fragment>
    );
};

const ThemeDisplay = () => {
    const { theme } = useTheme();

    return (
        <Block padding={1}>
            <SwatchesForColor label="Primary" color={theme.primary} />
            <Gap vertical />
            <SwatchesForColor label="Secondary" color={theme.secondary} />
            <Gap vertical />
            <SwatchesForColor label="Text" color={theme.text} />
            <Gap vertical />
            <SwatchesForColor label="Background" color={theme.background} />
        </Block>
    );
};

const Template = (args) => <ThemeProvider {...args} />;

export const Default = Template.bind({});
Default.args = {
    mode: "light",
    children: <ThemeDisplay />,
};

export const Light = Template.bind({});
Light.args = {
    mode: "light",
    children: <ThemeDisplay />,
};

export const Dark = Template.bind({});
Dark.args = {
    mode: "dark",
    children: <ThemeDisplay />,
};
