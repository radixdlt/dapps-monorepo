import { css } from '@styles'

export const connectBtn = css({
  gridItem: 'connect',
  justifySelf: 'right',
  alignSelf: 'center',
  marginRight: '$3xl'
})()

export const logo = css({
  gridItem: 'logo',
  fontFamily: 'StreetFighter',
  fontSize: '$4xl',
  justifySelf: 'center',
  alignSelf: 'center'
})

export const header = css({
  variants: {
    layout: {
      mobile: {
        // TODO
      },
      desktop: {
        display: 'grid',
        grid: '100% / 25% 50% 25%',
        height: 80,
        backgroundColor: '$success'
      }
    }
  }
})({
  layout: {
    '@small': 'mobile',
    '@medium': 'desktop',
    '@large': 'desktop'
  }
})

export const navbar = css({
  justifySelf: 'center',
  alignSelf: 'center'
})()
