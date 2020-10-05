import React from "react";
import cn from "classnames";
import { css } from "goober";

import Text from "../Text";

const H1Class = () => {
    return css`
        font-size: 2.5rem;
    `;
};

export const H1 = ({ children, ...props }) => {
    return (
        <Text
            as="h1"
            bold
            {...props}
            className={cn(H1Class(), props.className)}
        >
            {children}
        </Text>
    );
};

const H2Class = () => {
    return css`
        font-size: 2rem;
    `;
};

export const H2 = ({ children, ...props }) => {
    return (
        <Text
            as="h2"
            bold
            {...props}
            className={cn(H2Class(), props.className)}
        >
            {children}
        </Text>
    );
};

const H3Class = () => {
    return css`
        font-size: 1.5rem;
    `;
};

export const H3 = ({ children, ...props }) => {
    return (
        <Text
            as="h3"
            bold
            {...props}
            className={cn(H3Class(), props.className)}
        >
            {children}
        </Text>
    );
};

const H4Class = () => {
    return css`
        font-size: 1.25rem;
    `;
};

export const H4 = ({ children, ...props }) => {
    return (
        <Text as="h4" {...props} className={cn(H4Class(), props.className)}>
            {children}
        </Text>
    );
};

const H5Class = () => {
    return css`
        font-size: 1.15rem;
    `;
};

export const H5 = ({ children, ...props }) => {
    return (
        <Text as="h5" {...props} className={cn(H5Class(), props.className)}>
            {children}
        </Text>
    );
};

const H6Class = () => {
    return css`
        font-size: 0.95rem;
    `;
};

export const H6 = ({ children, ...props }) => {
    return (
        <Text as="h6" {...props} className={cn(H6Class(), props.className)}>
            {children}
        </Text>
    );
};
