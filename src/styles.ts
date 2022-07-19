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
            text: 'black'
        },
        space: {},
        fontSizes: {},
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
        transitions: {},
    },
})

globalCss({
    "*": {
        margin: 0,
        padding: 0,
        backgroundColor: 'SeaGreen',
    },
    'a:link': { 'text-decoration': 'none' },
    'a:visited': { 'text-decoration': 'none', color: '$text'  },
    'a:hover': { 'text-decoration': 'none' },
    'a:active': { 'text-decoration': 'none' }
})()
