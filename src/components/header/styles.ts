import { css } from '@styles'

export const header = css({
  display: 'flex',
  gap: 10,
  justifyContent: 'center',
  alignItems: 'center',
  p: '$sm',
  flexWrap: 'wrap',
  backgroundColor: '$surface',
  color: '$onSurface',
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
