import { createStitches } from '@stitches/core'

const colors = {
  background: '#E5E5E5',
  darkBackground: '#0B151D',
  blue: '	#052ec2',
  darkBlue: '#003057',
  white: '#ffffff',
  green: '#23b37e',
  grey: '#e6e6e6',
  grey2: '#8A8FA4',
  grey3: '#F4F5F9',
  grey4: '#172129',
  red: 'red',
  orange: 'orange',
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

type spaceKeys = `$${keyof typeof space}`

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
      background: colors.background,
      onBackground: colors.darkBlue,
      surface: colors.white,
      onSurface: colors.darkBlue,
      primary: colors.green,
      onPrimary: colors.white,
      action: colors.green,
      secondary: colors.darkBlue,
      error: colors.red,
      info: colors.blue,
      success: colors.green,
      warning: colors.orange,
      pickerBackground: colors.white,
      onPickerBackground: colors.darkBlue,
      primaryButton: colors.darkBlue,
      primaryButtonHover: colors.green,
      primaryButtonText: colors.white,
      primaryGhostButton: colors.white,
      primaryGhostButtonText: colors.darkBlue,
      primaryGhostButtonHover: colors.blue,
      primaryGhostButtonHoverText: colors.white,
      borderColor: colors.grey,
      grey: colors.grey,
      muted: colors.grey4,
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
      1: '100%'
    },
    borderWidths: {
      0: '0px',
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
    p: (value: spaceKeys) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value
    }),
    m: (value: spaceKeys) => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value
    }),
    pl: (value: spaceKeys) => ({
      paddingLeft: value
    }),
    py: (value: spaceKeys) => ({
      paddingTop: value,
      paddingBottom: value
    }),
    px: (value: spaceKeys) => ({
      paddingLeft: value,
      paddingRight: value
    }),
    my: (value: spaceKeys) => ({
      marginTop: value,
      marginBottom: value
    }),
    mx: (value: spaceKeys) => ({
      marginLeft: value,
      marginRight: value
    }),
    mt: (value: spaceKeys) => ({ marginTop: value }),
    mb: (value: spaceKeys) => ({ marginBottom: value }),
    ml: (value: spaceKeys) => ({ marginLeft: value }),
    mr: (value: spaceKeys) => ({ marginRight: value })
  }
})

export const darkTheme = createTheme({
  colors: {
    background: colors.darkBackground,
    onBackground: colors.grey3,
    surface: colors.grey4,
    onSurface: colors.grey3,
    onSurfaceDark: colors.grey2,
    primary: colors.green,
    onPrimary: colors.white,
    action: colors.green,
    secondary: colors.darkBlue,
    error: colors.red,
    info: colors.blue,
    success: colors.green,
    warning: colors.orange,
    pickerBackground: colors.white,
    onPickerBackground: colors.darkBlue,
    primaryButton: colors.green,
    primaryButtonHover: colors.darkBlue,
    primaryButtonText: colors.white,
    primaryGhostButton: colors.white,
    primaryGhostButtonText: colors.darkBlue,
    primaryGhostButtonHover: colors.blue,
    primaryGhostButtonHoverText: colors.white,
    borderColor: colors.grey,
    grey: colors.grey,
    muted: colors.grey4,
    transparent: 'transparent'
  }
})

globalCss({
  '*': {
    fontFamily: 'IBM Plex Sans',
    fontWeight: '400',
    margin: 0,
    padding: 0,
    color: '$text',
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
  'a:link': { 'text-decoration': 'none', color: '$text' },
  'a:visited': { 'text-decoration': 'none', color: '$text' },
  'a:hover': { 'text-decoration': 'none' },
  'a:active': { 'text-decoration': 'none' },
  'input:hover': { outline: 'none' },
  'input:focus': { outline: 'none' }
})()
