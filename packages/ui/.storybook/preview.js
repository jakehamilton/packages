import React from "react";
import { css } from "goober";

import { injectGlobalStyles } from "../src/util/theme";
import ThemeProvider from "../src/components/ThemeProvider";
import Block from "../src/components/Block";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
    (Story) => (
        <ThemeProvider>
            <Block
                color="background"
                className={css`
                    width: 100%;
                    height: 100%;
                `}
                padding={1}
            >
                <Story />
            </Block>
        </ThemeProvider>
    ),
];

injectGlobalStyles();
