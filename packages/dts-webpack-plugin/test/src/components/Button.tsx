import React from "react";

export interface ButtonProps {
    primary?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ primary, children }) => {
    return (
        <button
            style={{
                background: primary ? "blue" : "white",
            }}
        >
            {children}
        </button>
    );
};

export default Button;
