import { css } from '@styles'

export const navbar = css({
  marginTop: '$md',
  height: 30
})()

export const line = (width: number) =>
  css({
    position: 'absolute',
    background:
      'linear-gradient(19deg, hsl(191, 100%, 56%) 0%, hsl(281, 100%, 56%) 100%)',
    height: 4,
    width: `${width}px`,
    marginTop: '$lg',
    opacity: '50%'
  })()

export const slotParent = css({
  display: 'flex',
  flexDirection: 'row',
  '> *': {
    position: 'relative',
    marginLeft: 30,
    marginRight: 30
  }
})()
