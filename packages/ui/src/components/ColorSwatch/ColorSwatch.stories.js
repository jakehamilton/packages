import React from "react";

import ThemeProvider from "../ThemeProvider";
import ColorSwatch from ".";

export default {
    title: "Design/ColorSwatch",
    component: ColorSwatch,
};

const Template = (args) => (
    <ThemeProvider>
        <ColorSwatch {...args} />
    </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
    color: "#842dbf",
    label: "#842dbf",
    format: "block",
    size: "xlarge",
    round: true,
};

export const Block = Template.bind({});
Block.args = {
    color: "#842dbf",
    label: "#842dbf",
    format: "block",
    size: "xlarge",
    round: false,
};

export const Inline = Template.bind({});
Inline.args = {
    color: "#842dbf",
    label: "#842dbf",
    format: "inline",
    size: "xlarge",
    round: false,
};
