declare module "test/components/Button" {
import React from "react";
export interface ButtonProps {
    primary?: boolean;
}
export  const Button: React.FC<ButtonProps>;
export default Button;

}
declare module "test/index" {
export * from "test/components/Button";

}
declare module "test" {
import entry = require("test/index");
export = entry;
}
export * from "test/components/Button";
