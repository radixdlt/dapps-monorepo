import { css } from '@styles'

export const header = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  p: '$md',
  flexWrap: 'wrap',
  variants: {
    layout: {
      desktop: {
        justifyContent: 'space-between'
      }
    }
  }
})({
  layout: {
    '@medium': 'desktop',
    '@large': 'desktop'
  }
})
