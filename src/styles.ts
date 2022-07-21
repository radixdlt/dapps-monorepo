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
            primary: '#EE964B',
            primaryLight: '#F8D4B4',
            secondary: '#F95738',
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
        transitions: {},
    },
})

globalCss({
    "*": {
        margin: 0,
        padding: 0
    },
    body: {
        minWidth: '400px',
        backgroundColor: "$black",
        color: '$text'
    },
    'a:link': { 'text-decoration': 'none' },
    'a:visited': { 'text-decoration': 'none', color: '$text'  },
    'a:hover': { 'text-decoration': 'none' },
    'a:active': { 'text-decoration': 'none' }
})()
