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

const reveal = keyframes`
    from {
        clip-path: circle(0% at 50% 100%);
    }

    to {
        clip-path: circle(150% at 50% 100%);
    }
`;

const PopperClass = ({ animation }) => {
    let animationCSS;

    switch (animation) {
        default:
        case "reveal":
            animationCSS = `${reveal} 0.275s ease-in-out forwards`;
            break;
        case "fade":
            animationCSS = `${fade} 0.25s linear forwards`;
            break;
    }

    return css`
        opacity: ${animation === "fade" ? "0" : "1"};
        animation: ${animationCSS};
    `;
};

const ContentClass = () => {
    return css`
        border-radius: 6px;
    `;
};

const ArrowClass = ({ theme }) => {
    return css`
        transform: translateX(-100%);
        border-width: 6px 7px;
        border-style: solid;

        /* prettier-ignore */
        border-color: transparent ${theme.background
            .light} transparent transparent;
    `;
};

const Tooltip = ({
    text,
    delay = 1000,
    arrow = false,
    animation = "reveal",
    placement = "right",
    children,
}) => {
    if (!children) {
        throw new Error("Tooltip does not have a child.");
    }

    if (Array.isArray(children) && children.length > 1) {
        throw new Error("Tooltip can only have one child.");
    }

    const theme = useTheme();

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
        <React.Fragment>
            {clonedChild}
            {visible && text ? (
                <Popper
                    target={targetElement}
                    className={PopperClass({ animation })}
                    content={
                        <Block
                            elevation={3}
                            padding={1}
                            color="background.light"
                            className={ContentClass()}
                        >
                            {text}
                        </Block>
                    }
                    offset={[0, 10]}
                    arrow={arrow ? <div className={ArrowClass(theme)} /> : null}
                    placement={placement}
                />
            ) : null}
        </React.Fragment>
    );
};

Tooltip.propTypes = {
    text: PropTypes.string,
    delay: PropTypes.number,
    arrow: PropTypes.bool,
    animation: PropTypes.oneOf(["fade", "reveal"]),
    placement: PropTypes.oneOf([
        "auto",
        "auto-start",
        "auto-end",
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "right",
        "right-start",
        "right-end",
        "left",
        "left-start",
        "left-end",
    ]),
};

export default Tooltip;
