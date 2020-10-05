import React from "react";
import { css } from "goober";

import ThemeProvider from "../ThemeProvider";

import AppBar from ".";

export default {
    title: "Design/AppBar",
    component: AppBar,
};

const Template = (args) => (
    <ThemeProvider>
        <AppBar {...args} />
    </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
    left: "Left Content",
    right: "Right Content",
};

export const LightBackground = Template.bind({});
LightBackground.storyName = "Custom Background";
LightBackground.args = {
    left: "Left Content",
    right: "Right Content",
    color: "background.light",
};

export const Secondary = Template.bind({});
Secondary.storyName = "Secondary Background";
Secondary.args = {
    left: "Left Content",
    right: "Right Content",
    color: "secondary",
};
