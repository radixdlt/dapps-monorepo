import type { CSS } from '@stitches/core'
import { css } from '@styles'

export const btn = (style?: CSS) =>
  css({
    backgroundColor: '$primaryButton',
    fontSize: '$small',
    border: '0',
    '&:hover': {
      backgroundColor: '$grey'
    },
    padding: '$sm',
    borderRadius: '$md',
    color: '$primaryButtonText',
    ...style
  })()
