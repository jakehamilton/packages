import React from "react";
import { css } from "goober";

import Popper from ".";

export default {
    title: "Utility/Popper",
    component: Popper,
};

const Template = (args) => {
    const [targetElement, setTargetElement] = React.useState(null);
    return (
        <>
            <div
                ref={setTargetElement}
                className={css`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.075);
                    width: 180px;
                    height: 180px;
                `}
            >
                Target
            </div>
            <Popper
                {...args}
                target={targetElement}
                placement="right"
                offset={[0, 10]}
            />
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    content: (
        <div
            className={css`
                background: rgba(0, 0, 0, 0.2);
                padding: 8px;
                border-radius: 2px;
            `}
        >
            Popper
        </div>
    ),
};

export const Arrow = Template.bind({});
Arrow.args = {
    offset: [0, 10],
    content: (
        <div
            className={css`
                background: rgba(0, 0, 0, 0.2);
                padding: 8px;
                border-radius: 2px;
            `}
        >
            Popper Content
        </div>
    ),
    arrow: (
        <div
            className={
                // prettier-ignore
                css`
                    transition: transform 0.1s linear;
                    transform-origin: right center;
                    transform: translateX(-100%) scale(1);

                    border-width: 6px 7px;
                    border-color: transparent rgba(0, 0, 0, 0.2) transparent transparent;
                    border-style: solid;
                `
            }
        />
    ),
    arrowClassName: css`
        transition: transform 0.1s linear;

        &[data-hide] > * {
            transform: translateX(-100%) scale(0);
        }
    `,
};
