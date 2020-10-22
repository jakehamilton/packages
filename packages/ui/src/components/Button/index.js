import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { css } from "goober";

import useTheme from "../../hooks/useTheme";

const FilledButtonClass = ({
    background,
    lightBackground,
    color,
    shadow,
    activeShadow,
    padding,
}) => {
    return css`
        display: inline-block;
        outline: none;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        color: ${color};
        background: ${background};
        box-shadow: ${activeShadow};
        padding: ${padding[0]}px ${padding[1]}px;
        transform: translateY(0);
        transition: background 0.15s linear, box-shadow 0.15s linear,
            transform 0.075s linear;

        &:hover {
            box-shadow: ${shadow};
            background: ${lightBackground};
            transform: translateY(-2px);
        }

        &:active {
            background: ${lightBackground};
            box-shadow: ${activeShadow};
            transform: translateY(0);
        }

        &[disabled] {
            background: ${lightBackground};
            box-shadow: ${shadow};
            transform: translateY(0);
        }
    `;
};

const OutlinedButtonClass = ({
    background,
    lightBackground,
    darkBackground,
    color,
    shadow,
    activeShadow,
    padding,
}) => {
    return css`
        display: inline-block;
        outline: none;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        color: ${background};
        background: transparent;
        padding: ${padding[0]}px ${padding[1]}px;
        border: 1px solid ${background};
        transition: background 0.15s linear, box-shadow 0.05s linear,
            border-color 0.15s linear, color 0.15s linear;

        &:hover {
            color: ${lightBackground};
            border-color: ${lightBackground};
        }

        &:active {
            color: ${darkBackground};
            border-color: ${darkBackground};
        }

        &[disabled] {
            color: ${lightBackground};
            border-color: ${lightBackground};
        }
    `;
};

const TextButtonClass = ({
    background,
    lightBackground,
    darkBackground,
    padding,
}) => {
    return css`
        display: inline-block;
        outline: none;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        color: ${background};
        background: transparent;
        padding: ${padding[0]}px ${padding[1]}px;
        transition: background 0.15s linear, box-shadow 0.05s linear;

        &:hover {
            color: ${lightBackground};
        }

        &:active {
            color: ${darkBackground};
        }

        &[disabled] {
            color: ${lightBackground};
        }
    `;
};

const Button = ({
    as = "button",
    color = "primary",
    variant = "filled",
    invert = false,
    className,
    children,
    ...props
}) => {
    const { theme, shadow, pad } = useTheme();

    let ButtonClass;

    switch (variant) {
        default:
        case "filled":
            ButtonClass = FilledButtonClass;
            break;
        case "outlined":
            ButtonClass = OutlinedButtonClass;
            break;
        case "text":
            ButtonClass = TextButtonClass;
            break;
    }

    return React.createElement(
        as,
        {
            ...props,
            className: cn(
                ButtonClass({
                    background: invert
                        ? theme.background.light
                        : theme[color].main,
                    lightBackground: invert
                        ? theme.background.light
                        : theme[color].light,
                    darkBackground: invert
                        ? theme.background.main
                        : theme[color].dark,
                    color: invert ? theme[color].main : theme[color].text,
                    shadow: shadow(3),
                    activeShadow: shadow(1),
                    padding: [pad(1), pad(2)],
                }),
                className
            ),
        },
        children
    );
};

Button.propTypes = {
    color: PropTypes.string,
    variant: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Button;
