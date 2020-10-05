import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { css } from "goober";
import tinycolor from "tinycolor2";
import useTheme from "../../hooks/useTheme";
import Block from "../Block";

const AppBarClass = ({ color }) => {
    const textColor = tinycolor
        .mostReadable(color, ["#000", "#fff"])
        .toHexString();

    return css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${textColor};
        background: ${color};
        height: 4rem;
    `;
};

const AppBarLeftClass = () => {
    return css`
        display: flex;
        align-items: center;
    `;
};

const AppBarRightClass = () => {
    return css`
        display: flex;
        align-items: center;
    `;
};

const AppBar = ({
    left = null,
    right = null,
    color = "primary",
    className,
    ...props
}) => {
    const { theme } = useTheme();

    const [property, variant = "main"] = color.split(".");

    return (
        <Block
            className={cn(
                AppBarClass({
                    color: theme[property][variant],
                }),
                className
            )}
            elevation={3}
            padding={2}
            {...props}
        >
            <div className={AppBarLeftClass()}>{left}</div>
            <div className={AppBarRightClass()}>{right}</div>
        </Block>
    );
};

AppBar.propTypes = {
    left: PropTypes.node,
    right: PropTypes.node,
    color: PropTypes.string,
    className: PropTypes.string,
};

export default AppBar;
