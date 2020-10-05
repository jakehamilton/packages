import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { css } from "goober";

import useTheme from "../../hooks/useTheme";

const BlockClass = ({ shadow, padding }) => {
    return css`
        padding: ${padding}px;
        box-shadow: ${shadow};
    `;
};

const Block = ({
    as = "div",
    elevation = 0,
    padding = 0,
    className,
    children,
    ...props
}) => {
    const { theme, pad, shadow } = useTheme();

    return (
        <div
            className={cn(
                className,
                BlockClass({
                    shadow: shadow(elevation),
                    padding: pad(padding),
                })
            )}
            {...props}
        >
            {children}
        </div>
    );
};

Block.propTypes = {
    as: PropTypes.elementType,
    elevation: PropTypes.number,
    padding: PropTypes.number,
    className: PropTypes.string,
};

export default Block;
