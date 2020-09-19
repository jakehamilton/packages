module.exports = {
    title: "@jakehamilton",
    description:
        "Documentation for packages in the @jakehamilton namespace on npm.",
    base: process.env.BASE_URL || "/",
    evergreen: true,
    plugins: [
        "@vuepress/active-header-links",
        "@vuepress/back-to-top",
        "@vuepress/nprogress",
        "@vuepress/pwa",
    ],
    markdown: {
        lineNumbers: true,
    },
    themeConfig: {
        lastUpdated: "Last Updated",
        nextLinks: true,
        prevLinks: true,
        repo: "jakehamilton/packages",
        editLinks: true,
        editLinkText: "Help improve this page",
        sidebar: {
            "/": [
                {
                    title: "Packages",
                    collapsable: false,
                    children: ["/dts-webpack-plugin/"],
                },
            ],
        },
    },
};
