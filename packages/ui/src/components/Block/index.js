import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { css } from "goober";

import useTheme from "../../hooks/useTheme";

const BlockClass = ({
    theme,
    shadow,
    pad,
    padding,
    elevation,
    color,
    variant,
}) => {
    const background =
        theme[color] && theme[color][variant] ? theme[color][variant] : color;

    return css`
        padding: ${pad(padding)}px;
        box-shadow: ${shadow(elevation)};
        background: ${background};
    `;
};

const Block = ({
    as = "div",
    elevation = 0,
    padding = 0,
    color = "background.light",
    className,
    children,
    ...props
}) => {
    const theme = useTheme();

    const [themeColor, themeColorVariant = "main"] = color.split(".");

    return React.createElement(
        as,
        {
            ...props,
            className: cn(
                className,
                BlockClass({
                    ...theme,
                    elevation,
                    padding,
                    color: themeColor,
                    variant: themeColorVariant,
                })
            ),
        },
        children
    );
};

Block.propTypes = {
    as: PropTypes.elementType,
    elevation: PropTypes.number,
    padding: PropTypes.number,
    className: PropTypes.string,
};

export default Block;
