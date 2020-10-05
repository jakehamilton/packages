import React from "react";
import PropTypes from "prop-types";
import { css, keyframes } from "goober";

import Popper from "../Popper";
import Block from "../Block";
import useTheme from "../../hooks/useTheme";

const fade = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`;

const PopperClass = () => {
    return css`
        animation: ${fade} 0.075s linear forwards;
    `;
};

const ContentClass = ({ background }) => {
    return css`
        border-radius: 6px;
    `;
};

const ArrowClass = ({ background }) => {
    return css`
        transform: translateX(-100%);
        border-width: 6px 7px;
        border-color: transparent ${background} transparent transparent;
        border-style: solid;
    `;
};

const Tooltip = ({ text, delay = 1000, children }) => {
    if (!children) {
        throw new Error("Tooltip does not have a child.");
    }

    if (Array.isArray(children) && children.length > 1) {
        throw new Error("Tooltip can only have one child.");
    }

    const { theme } = useTheme();

    const child = Array.isArray(children) ? children[0] : children;

    const [visible, setVisible] = React.useState(false);
    const [targetElement, setTargetElement] = React.useState(null);

    const timeoutRef = React.useRef(null);

    const handleMouseEnter = React.useCallback(() => {
        if (timeoutRef.current) {
            return;
        }

        timeoutRef.current = setTimeout(() => {
            setVisible(true);
        }, delay);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setVisible(false);
    }, []);

    const clonedChild = React.cloneElement(child, {
        ref: setTargetElement,
        "aria-label": text,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    });

    return (
        <>
            {clonedChild}
            {visible && text ? (
                <Popper
                    target={targetElement}
                    className={PopperClass()}
                    content={
                        <Block
                            elevation={3}
                            padding={1}
                            className={ContentClass({
                                background: theme.background.light,
                            })}
                        >
                            {text}
                        </Block>
                    }
                    offset={[0, 10]}
                    arrow={
                        <div
                            className={ArrowClass({
                                background: theme.background.light,
                            })}
                        />
                    }
                    placement="right"
                />
            ) : null}
        </>
    );
};

Tooltip.propTypes = {
    text: PropTypes.string,
    delay: PropTypes.number,
};

export default Tooltip;
