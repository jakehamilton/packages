import React from "react";

import ThemeProvider from "../ThemeProvider";

import Button from ".";

export default {
    title: "Design/Button",
    component: Button,
};

const Template = (args) => (
    <ThemeProvider>
        <Button {...args} />
    </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
    children: "Click Me",
};

export const Filled = Template.bind({});
Filled.args = {
    children: "Click Me",
    color: "primary",
    variant: "filled",
};

export const Outlined = Template.bind({});
Outlined.args = {
    children: "Click Me",
    color: "primary",
    variant: "outlined",
};

export const Text = Template.bind({});
Text.args = {
    children: "Click Me",
    color: "primary",
    variant: "text",
};

export const Disabled = Template.bind({});
Disabled.args = {
    children: "Click Me",
    color: "primary",
    variant: "filled",
    disabled: true,
};
