import { css } from '@styles'

export const navbar = css({
  marginTop: 15,
  height: 30
})()

export const line = (width: number) =>
  css({
    position: 'absolute',
    background:
      'linear-gradient(19deg, hsl(191, 100%, 56%) 0%, hsl(281, 100%, 56%) 100%)',
    height: 4,
    width: `${width}px`,
    marginTop: '22px',
    borderRadius: '5px',
    opacity: '50%'
  })()

export const slotParent = css({
  '> *': {
    position: 'relative',
    marginLeft: 30,
    marginRight: 30
  }
})()
