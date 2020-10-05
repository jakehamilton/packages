import React from "react";

import ThemeProvider from "../ThemeProvider";
import Text from ".";

export default {
    title: "Design/Text",
    component: Text,
};

const Template = (args) => (
    <ThemeProvider>
        <Text {...args} />
    </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
    children: "Hello, World",
};

export const Primary = Template.bind({});
Primary.args = {
    children: "Hello, World",
    color: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
    children: "Hello, World",
    color: "secondary",
};

export const Styled = Template.bind({});
Styled.args = {
    children: "Hello, World",
    bold: true,
    italic: true,
    underline: true,
};
