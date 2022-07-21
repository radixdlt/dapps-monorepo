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
            black: 'hsl(0, 0%, 20%)',
            darker: 'hsl(0, 0%, 32%)',
            dark: 'hsl(0, 0%, 44%)',
            primary: 'hsl(162, 100%, 64%)',
            primaryLight: 'hsl(162, 100%, 80%)',
            secondary: 'hsl(10, 94%, 60%)',
            contrast: 'hsl(171, 78%, 69%)',
            text: 'hsl(120, 100%, 98%)'
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
    }
})

globalCss({
    "*": {
        margin: 0,
        padding: 0,
        color: '$text'
    },
    body: {
        minWidth: '400px',
        backgroundColor: "$black",
        color: '$text'
    },
    'a:link': { 'text-decoration': 'none', color: '$text' },
    'a:visited': { 'text-decoration': 'none', color: '$text' },
    'a:hover': { 'text-decoration': 'none' },
    'a:active': { 'text-decoration': 'none' },
    'input:hover': { 'outline': 'none' },
    'input:focus': { 'outline': 'none' }
})()
