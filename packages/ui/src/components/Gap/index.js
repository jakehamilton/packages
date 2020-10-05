import React from "react";
import PropTypes from "prop-types";
import { css } from "goober";
import cn from "classnames";

import useTheme from "../../hooks/useTheme";

const HorizontalGapClass = ({ padding }) => {
    return css`
        padding-left: ${padding}px;
    `;
};
const VerticalGapClass = ({ padding }) => {
    return css`
        padding-top: ${padding}px;
    `;
};

const Gap = ({ horizontal, vertical, size = 1 }) => {
    const { pad } = useTheme();

    const padding = pad(size);

    return (
        <div
            className={cn({
                [HorizontalGapClass({ padding })]: horizontal,
                [VerticalGapClass({ padding })]: vertical,
            })}
        />
    );
};

Gap.propTypes = {
    horizontal: PropTypes.bool,
    vertical: PropTypes.bool,
    size: PropTypes.number,
};

export default Gap;
