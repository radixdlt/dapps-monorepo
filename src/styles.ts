import { createStitches } from "@stitches/core"

export const {
    css,
    globalCss,
    keyframes,
    theme,
    createTheme,
    getCssText,
    config
} = createStitches({
    theme: {
        colors: {
            black: '#343434',
            darker: '#525252',
            dark: '#707070',
            primary: '#47FFC8',
            primaryLight: '#F8D4B4',
            secondary: '#F95738',
            contrast: '#73EEDC',
            text: '#F7FFF7'
        },
        space: {},
        fontSizes: {
            small: '13px'
        },
        fonts: {},
        fontWeights: {},
        lineHeights: {},
        letterSpacings: {},
        sizes: {},
        borderWidths: {},
        borderStyles: {},
        radii: {},
        shadows: {},
        zIndices: {},
        transitions: {}
    },
    utils: {
        linearGradient: (value: string) => ({
            backgroundImage: `linear-gradient(${value})`,
        }),
    }
})

globalCss({
    "*": {
        margin: 0,
        padding: 0,
    },
    body: {
        minWidth: '400px',
        backgroundColor: "$black",
        color: '$text'
    },
    'a:link': { 'text-decoration': 'none' },
    'a:visited': { 'text-decoration': 'none', color: '$text' },
    'a:hover': { 'text-decoration': 'none' },
    'a:active': { 'text-decoration': 'none' }
})()
