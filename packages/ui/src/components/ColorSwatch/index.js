import React from "react";
import PropTypes from "prop-types";
import tinycolor from "tinycolor2";
import { css } from "goober";
import useTheme from "../../hooks/useTheme";

const BLOCK_COLOR_SWATCH_SIZES = {
    small: "16px",
    medium: "32px",
    large: "84px",
    xlarge: "128px",
};

const BLOCK_COLOR_SWATCH_BORDER_RADIUSES = {
    small: "2px",
    medium: "3px",
    large: "4px",
    xlarge: "5px",
};

const BlockColorSwatchClass = ({ color, size, round }) => {
    return css`
        display: flex;
        align-items: ${round ? "center" : "flex-end"};
        justify-content: ${round ? "center" : "flex-end"};
        width: ${BLOCK_COLOR_SWATCH_SIZES[size]};
        height: ${BLOCK_COLOR_SWATCH_SIZES[size]};
        background: ${color};
        border-radius: ${round
            ? "50%"
            : BLOCK_COLOR_SWATCH_BORDER_RADIUSES[size]};
        padding: ${size === "large" ? "8px" : "12px"};
    `;
};

const BlockColorSwatchLabelClass = ({ color }) => {
    const textColor = tinycolor
        .mostReadable(color, ["#000", "#fff"])
        .toHexString();

    return css`
        color: ${textColor};
    `;
};

const BlockColorSwatch = ({ color, label, size, round }) => {
    return (
        <div className={BlockColorSwatchClass({ color, size, round })}>
            {label === "" || size === "small" || size === "medium" ? null : (
                <span className={BlockColorSwatchLabelClass({ color })}>
                    {label}
                </span>
            )}
        </div>
    );
};

const INLINE_COLOR_SWATCH_LABEL_SIZES = {
    small: "1rem",
    medium: "1rem",
    large: "1.25rem",
    xlarge: "1.75rem",
};

const INLINE_COLOR_SWATCH_LABEL_PADDINGS = {
    small: 1,
    medium: 1,
    large: 2,
    xlarge: 2,
};

const InlineColorSwatchClass = ({ size }) => {
    return css`
        display: flex;
        align-items: center;
    `;
};

const InlineColorSwatchLabelClass = ({ size }) => {
    const { pad } = useTheme();

    return css`
        font-size: ${INLINE_COLOR_SWATCH_LABEL_SIZES[size]};
        padding-left: ${pad(INLINE_COLOR_SWATCH_LABEL_PADDINGS[size])}px;
    `;
};

const InlineColorSwatch = ({ color, label, size, round }) => {
    return (
        <div className={InlineColorSwatchClass({ size })}>
            <div className={BlockColorSwatchClass({ color, size, round })} />
            <span className={InlineColorSwatchLabelClass({ size })}>
                {label}
            </span>
        </div>
    );
};

const ColorSwatch = ({
    color,
    label = null,
    format = "block",
    size = "small",
    round = false,
}) => {
    switch (format) {
        default:
        case "block":
            return (
                <BlockColorSwatch
                    color={color}
                    label={label}
                    size={size}
                    round={round}
                />
            );
        case "inline":
            return (
                <InlineColorSwatch
                    color={color}
                    label={label}
                    size={size}
                    round={round}
                />
            );
    }
};

ColorSwatch.propTypes = {
    color: PropTypes.string.isRequired,
    label: PropTypes.node,
    format: PropTypes.oneOf(["inline", "block"]),
    size: PropTypes.oneOf(["small", "medium", "large", "xlarge"]),
    round: PropTypes.bool,
};

export default ColorSwatch;
