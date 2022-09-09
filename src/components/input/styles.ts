import { css } from '@styles'
import type { SpaceKeys } from '@styles'

export const input = (borderRadius: SpaceKeys, icon?: string) =>
  css({
    color: '$onSurface',
    border: 'none',
    borderRadius,
    padding: '$sm',
    icon: icon
      ? {
          background: `url(${icon}) no-repeat`,
          backgroundSize: '20px',
          backgroundPosition: 'right 10px center'
        }
      : undefined,
    backgroundColor: '$surface'
  })()
