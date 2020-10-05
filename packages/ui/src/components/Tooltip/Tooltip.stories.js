import React from "react";

import Tooltip from ".";
import ThemeProvider from "../ThemeProvider";
import { css } from "goober";

export default {
    title: "Design/Tooltip",
    component: Tooltip,
};

const Template = (args) => (
    <ThemeProvider>
        <Tooltip {...args}>
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 180px;
                    height: 180px;
                    background: rgba(0, 0, 0, 0.075);
                `}
            >
                Some Content
            </div>
        </Tooltip>
    </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
    text: "Hello, World",
};
