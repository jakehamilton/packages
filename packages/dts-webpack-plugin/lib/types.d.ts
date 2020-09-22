import webpack from "webpack";

interface Aliases {
    [key: string]: string[];
}

interface PluginOptions {
    root?: string;
    entry?: string;
    tsc?: string;
    tsconfig?: string;
    match?: (name: string) => boolean;
    transforms?: {
        module?: (
            origin: string,
            identifier: string,
            line: string,
            files: string[],
            aliases: Aliases
        ) => string | undefined;
    };
}

class DTSWebpackPlugin {
    constructor(options?: PluginOptions);
    apply(compiler: webpack.Compiler): void;
    compile(compilation: webpack.compilation.Compilation, temp: string);
}

export = DTSWebpackPlugin;
