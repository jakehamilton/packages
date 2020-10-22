import React from "react";
import PropTypes from "prop-types";
import { usePopper } from "react-popper";

const Popper = ({
    target,
    content,
    arrow,
    className,
    arrowClassName,
    placement = "auto",
    offset,
}) => {
    const [popperElement, setPopperElement] = React.useState(null);
    const [arrowElement, setArrowElement] = React.useState(null);

    const modifiers = React.useMemo(() => {
        const modifiers = [];

        if (arrow) {
            modifiers.push({
                name: "arrow",
                options: { element: arrowElement },
            });

            modifiers.push({
                name: "applyArrowHide",
                enabled: true,
                phase: "write",
                fn({ state }) {
                    const { arrow } = state.elements;

                    if (arrow) {
                        if (state.modifiersData.arrow.centerOffset !== 0) {
                            arrow.setAttribute("data-hide", "");
                        } else {
                            arrow.removeAttribute("data-hide");
                        }
                    }
                },
            });
        }

        if (offset) {
            modifiers.push({
                name: "offset",
                options: {
                    offset,
                },
            });
        }

        return modifiers;
    }, [arrow, arrowElement]);

    const { styles, attributes } = usePopper(target, popperElement, {
        modifiers,
        placement,
    });

    return (
        <div
            ref={setPopperElement}
            className={className}
            style={styles.popper}
            {...attributes.popper}
        >
            {content}
            {arrow ? (
                <div
                    ref={setArrowElement}
                    className={arrowClassName}
                    style={styles.arrow}
                >
                    {arrow}
                </div>
            ) : null}
        </div>
    );
};

Popper.propTypes = {
    target: PropTypes.instanceOf(Element),
    content: PropTypes.node,
    arrow: PropTypes.node,
    className: PropTypes.string,
    arrowClassName: PropTypes.string,
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
    offset: PropTypes.arrayOf(PropTypes.number),
};

export default Popper;
