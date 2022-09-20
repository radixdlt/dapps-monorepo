import { createStitches } from '@stitches/core'

const colors = {
  // Core colors
  blue1: '#060F8F',
  blue2: '#052CC0',
  // Accent colors
  blue3: '#20E4FF',
  pink1: '#CE0D98',
  pink2: '#FF43CA',
  green1: '#00AB84',
  green2: '#00C389',
  green3: '#21FFBE',
  // Neutral colors
  white: '#ffffff',
  charcoal1: '#414141',
  grey0: '#0B151D',
  grey01: '#172129',
  grey1: '#003057',
  grey2: '#8A8FA4',
  grey3: '#CED0D6',
  grey4: '#E2E5ED',
  grey5: '#F4F5F9',
  transparent: 'transparent'
}

export const space = {
  0: '0px',
  '2xs': '2px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '80px',
  '6xl': '96px',
  '7xl': '160px'
}

export type SpaceKeys = `$${keyof typeof space}`

export const {
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config
} = createStitches({
  theme: {
    colors: {
      background: colors.grey3,
      onBackground: colors.grey1,
      surface: colors.white,
      onSurface: colors.grey1,
      primary: colors.green1,
      onPrimary: colors.white,
      action: colors.green1,
      secondary: colors.grey1,
      pickerBackground: colors.white,
      onPickerBackground: colors.grey1,
      primaryButton: colors.grey1,
      primaryButtonHover: colors.green1,
      primaryButtonText: colors.white,
      primaryGhostButton: colors.white,
      primaryGhostButtonText: colors.grey1,
      primaryGhostButtonHover: colors.blue1,
      primaryGhostButtonHoverText: colors.white,
      borderColor: colors.grey4,
      grey: colors.grey1,
      muted: colors.grey2,
      text: colors.grey1,
      transparent: 'transparent'
    },
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
      '5xl': '36px',
      '6xl': '42px',
      '7xl': '48px',
      '8xl': '54px',
      '9xl': '60px',
      '10xl': '68px',
      '11xl': '76px',
      '12xl': '84px',
      '13xl': '92px'
    },
    radii: {
      sm: '3px',
      md: '10px',
      lg: '15px'
    },
    space,
    fontWeights: {
      200: '200',
      400: '400',
      600: '600'
    },
    sizes: {
      sm: '24px',
      md: '32px',
      lg: '48px',
      xl: '64px',
      '2xl': '96px',
      '3xl': '128px',
      '4xl': '256px',
      '5xl': '352px',
      '1/10': '10%',
      '1/5': '20%',
      '1/4': '25%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      1: '100%'
    },
    borderWidths: {
      0: '0px',
      sm: '1px',
      md: '10px'
    }
  },
  media: {
    small: '(min-width: 640px)',
    medium: '(min-width: 768px)',
    large: '(min-width: 1024px)'
  },
  utils: {
    p: (value: SpaceKeys) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value
    }),
    m: (value: SpaceKeys) => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value
    }),
    pl: (value: SpaceKeys) => ({
      paddingLeft: value
    }),
    py: (value: SpaceKeys) => ({
      paddingTop: value,
      paddingBottom: value
    }),
    px: (value: SpaceKeys) => ({
      paddingLeft: value,
      paddingRight: value
    }),
    my: (value: SpaceKeys) => ({
      marginTop: value,
      marginBottom: value
    }),
    mx: (value: SpaceKeys) => ({
      marginLeft: value,
      marginRight: value
    }),
    mt: (value: SpaceKeys) => ({ marginTop: value }),
    mb: (value: SpaceKeys) => ({ marginBottom: value }),
    ml: (value: SpaceKeys) => ({ marginLeft: value }),
    mr: (value: SpaceKeys) => ({ marginRight: value })
  }
})

export const darkTheme = createTheme({
  colors: {
    background: colors.grey0,
    onBackground: colors.grey3,
    surface: colors.grey01,
    onSurface: colors.grey3,
    onSurfaceDark: colors.grey2,
    primary: colors.green1,
    onPrimary: colors.white,
    action: colors.green1,
    secondary: colors.grey1,
    pickerBackground: colors.white,
    onPickerBackground: colors.grey1,
    primaryButton: colors.green1,
    primaryButtonHover: colors.grey1,
    primaryButtonText: colors.white,
    primaryGhostButton: colors.white,
    primaryGhostButtonText: colors.grey1,
    primaryGhostButtonHover: colors.blue1,
    primaryGhostButtonHoverText: colors.white,
    borderColor: colors.grey4,
    grey: colors.grey1,
    muted: colors.grey2,
    transparent: 'transparent'
  }
})

globalCss({
  '*': {
    fontFamily: 'IBM Plex Sans',
    fontWeight: '400',
    margin: 0,
    padding: 0,
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none'
  },
  '*::-webkit-scrollbar': {
    display: 'none'
  },
  body: {
    minWidth: '400px',
    backgroundColor: '$background',
    color: '$onBackground'
  },
  'a:link': { 'text-decoration': 'none', color: 'inherit' },
  'a:visited': { 'text-decoration': 'none', color: 'inherit' },
  'a:hover': { 'text-decoration': 'none' },
  'a:active': { 'text-decoration': 'none' },
  'input:hover': { outline: 'none' },
  'input:focus': { outline: 'none' }
})()
