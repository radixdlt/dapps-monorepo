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
            textColor: 'black'
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
        transitions: {},
    },
})

globalCss({
    "*": {
        margin: 0,
        padding: 0
    },
    'a:link': { 'text-decoration': 'none' },
    'a:visited': { 'text-decoration': 'none', color: '$text'  },
    'a:hover': { 'text-decoration': 'none' },
    'a:active': { 'text-decoration': 'none' }
})()
