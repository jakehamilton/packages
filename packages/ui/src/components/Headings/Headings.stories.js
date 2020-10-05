import React from "react";

import ThemeProvider from "../ThemeProvider";
import Gap from "../Gap";

import * as Headings from ".";

export default {
    title: "Design/Headings",
};

export const Default = () => (
    <ThemeProvider>
        <Headings.H1>Heading</Headings.H1>
        <Headings.H4>Subheading</Headings.H4>
        <Gap vertical size={2} />
        <Headings.H2>Heading</Headings.H2>
        <Headings.H5>Subheading</Headings.H5>
        <Gap vertical size={2} />
        <Headings.H3>Heading</Headings.H3>
        <Headings.H6>Subheading</Headings.H6>
    </ThemeProvider>
);

export const H1 = () => <Headings.H1>Heading</Headings.H1>;
export const H2 = () => <Headings.H2>Heading</Headings.H2>;
export const H3 = () => <Headings.H3>Heading</Headings.H3>;
export const H4 = () => <Headings.H4>Heading</Headings.H4>;
export const H5 = () => <Headings.H5>Heading</Headings.H5>;
export const H6 = () => <Headings.H6>Heading</Headings.H6>;
