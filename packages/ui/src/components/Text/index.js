import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { css } from "goober";

import useTheme from "../../hooks/useTheme";

const TextClass = ({ color, bold, italic, underline }) => {
    return css`
        color: ${color};
        font-weight: ${bold ? "bold" : "normal"};
        font-style: ${italic ? "italic" : "unset"};
        text-decoration: ${underline ? "underline" : "none"};
    `;
};

const Text = ({
    as = "span",
    color = "text",
    bold = false,
    italic = false,
    underline = false,
    children,
    ...props
} = {}) => {
    const { theme } = useTheme();

    const [property, variant = "main"] = color.split(".");

    return React.createElement(
        as,
        {
            ...props,
            className: cn(
                TextClass({
                    color: theme[property][variant],
                    bold,
                    italic,
                    underline,
                }),
                props.className
            ),
        },
        children
    );
};

Text.propTypes = {
    as: PropTypes.elementType,
    color: PropTypes.string,
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    underline: PropTypes.bool,
};

export default Text;
