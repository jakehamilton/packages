import React from "react";
import { css } from "goober";

import ThemeProvider from "../ThemeProvider";

import Block from ".";

export default {
    title: "Design/Block",
    component: Block,
};

const Template = (args) => (
    <ThemeProvider>
        <Block
            {...args}
            className={css`
                width: 180px;
                height: 180px;
            `}
        />
    </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
    elevation: 1,
};

export const Elevation1 = Template.bind({});
Elevation1.storyName = "Elevation 1";
Elevation1.args = {
    elevation: 1,
};

export const Elevation2 = Template.bind({});
Elevation2.storyName = "Elevation 2";
Elevation2.args = {
    elevation: 2,
};

export const Elevation3 = Template.bind({});
Elevation3.storyName = "Elevation 3";
Elevation3.args = {
    elevation: 3,
};

export const Elevation4 = Template.bind({});
Elevation4.storyName = "Elevation 4";
Elevation4.args = {
    elevation: 4,
};

export const Elevation5 = Template.bind({});
Elevation5.storyName = "Elevation 5";
Elevation5.args = {
    elevation: 5,
};
