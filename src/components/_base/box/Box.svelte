<script lang="ts">
  import type { CSS, VariantProps } from '@stitches/core'
  import { css, config } from '@styles'

  const variants = {
    full: {
      true: {
        width: '100%'
      }
    },
    inline: {
      true: {
        display: 'inline-flex'
      }
    },
    pointer: {
      true: {
        cursor: 'pointer'
      }
    },
    interactiveText: {
      true: {
        cursor: 'pointer',
        transition: 'color .2s,border-color .2s,background-color .2s',
        '&:hover': {
          color: '$primaryTextHover'
        }
      }
    },
    interactive: {
      true: {
        cursor: 'pointer',
        transition: 'color .2s,border-color .2s,background-color .2s',
        '&:hover': {
          backgroundColor: '$grey'
        }
      }
    },
    mt: {
      xsmall: {
        mt: '$xs'
      },
      small: {
        mt: '$sm'
      },
      medium: {
        mt: '$md'
      },
      large: {
        mt: '$lg'
      },
      none: {
        mt: '$0'
      }
    },
    m: {
      xsmall: {
        m: '$xs'
      },
      small: {
        m: '$sm'
      },
      medium: {
        m: '$md'
      },
      large: {
        m: '$lg'
      },
      none: {
        m: '$0'
      }
    },
    p: {
      xsmall: {
        p: '$xs'
      },
      small: {
        p: '$sm'
      },
      medium: {
        p: '$md'
      },
      large: {
        p: '$lg'
      },
      none: {
        p: '$0'
      }
    },
    mx: {
      xsmall: {
        mx: '$xs'
      },
      small: {
        mx: '$sm'
      },
      medium: {
        mx: '$md'
      },
      large: {
        mx: '$lg'
      },
      none: {
        mx: '$0'
      }
    },
    my: {
      xsmall: {
        my: '$xs'
      },
      small: {
        my: '$sm'
      },
      medium: {
        my: '$md'
      },
      large: {
        my: '$lg'
      },
      none: {
        my: '$0'
      }
    },
    py: {
      xsmall: {
        py: '$xs'
      },
      small: {
        py: '$sm'
      },
      medium: {
        py: '$md'
      },
      large: {
        py: '$lg'
      },
      none: {
        py: '$0'
      }
    },
    px: {
      xsmall: {
        px: '$xs'
      },
      small: {
        px: '$sm'
      },
      medium: {
        px: '$md'
      },
      large: {
        px: '$lg'
      },
      none: {
        px: '$0'
      }
    },
    border: {
      true: {
        borderColor: '$borderColor',
        borderStyle: 'solid',
        borderRadius: '$sm'
      }
    },
    flex: {
      row: {
        display: 'flex',
        flexDirection: 'row'
      },
      col: {
        display: 'flex',
        flexDirection: 'column'
      }
    },
    items: {
      start: {
        display: 'flex',
        justifyContent: 'flex-start'
      },
      center: {
        display: 'flex',
        alignItems: 'center'
      },
      stretch: {
        display: 'flex',
        alignItems: 'stretch'
      },
      between: {
        display: 'flex',
        alignItems: 'space-between'
      },
      around: {
        display: 'flex',
        alignItems: 'space-around'
      },
      evenly: {
        display: 'flex',
        alignItems: 'space-evenly'
      }
    },
    justify: {
      start: {
        display: 'flex',
        justifyContent: 'flex-start'
      },
      end: {
        display: 'flex',
        justifyContent: 'flex-end'
      },
      center: {
        display: 'flex',
        justifyContent: 'center'
      },
      between: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      around: {
        display: 'flex',
        justifyContent: 'space-around'
      },
      evenly: {
        display: 'flex',
        justifyContent: 'space-evenly'
      },
      gridEnd: {
        justifySelf: 'end'
      }
    },
    position: {
      relative: {
        position: 'relative'
      },
      absolute: {
        position: 'absolute'
      }
    },
    grid: {
      auto: {
        display: 'grid',
        gridTemplateColumns: 'auto'
      }
    },
    gap: {
      xsmall: {
        gap: '$xs'
      },
      small: {
        gap: '$sm'
      },
      medium: {
        gap: '$md'
      },
      large: {
        gap: '$lg'
      },
      none: {
        gap: '$0'
      }
    },
    shadow: {
      true: {
        shadow: true
      }
    }
  } as const

  export let transparent: boolean = false

  export let cx: CSS<typeof config> = {}

  const box = css({
    backgroundColor: `${transparent ? 'transparent' : '$surface'}`,
    borderRadius: '$sm',
    p: '$md',
    color: '$onSurface',
    variants,
    ...cx
  })

  type variantProps = VariantProps<typeof box>

  export let full: true | false = false
  export let pointer: true | false = false
  export let interactive: true | false = false
  export let interactiveText: true | false = false
  export let inline: true | false = false
  export let p: keyof typeof variants['p'] | undefined = undefined
  export let m: keyof typeof variants['m'] | undefined = undefined
  export let py: keyof typeof variants['py'] | undefined = undefined
  export let px: keyof typeof variants['px'] | undefined = undefined
  export let my: keyof typeof variants['my'] | undefined = undefined
  export let mx: keyof typeof variants['mx'] | undefined = undefined
  export let mt: keyof typeof variants['mt'] | undefined = undefined
  export let border: variantProps['border'] = false
  export let flex: keyof typeof variants['flex'] | undefined = undefined
  export let items: keyof typeof variants['items'] | undefined = undefined
  export let justify: keyof typeof variants['justify'] | undefined = undefined
  export let grid: keyof typeof variants['grid'] | undefined = undefined
  export let gap: keyof typeof variants['gap'] | undefined = undefined

  export let shadow: boolean | undefined = undefined
</script>

<div
  on:click
  on:outroend
  class={box({
    full,
    pointer,
    interactive,
    interactiveText,
    inline,
    p,
    px,
    py,
    m,
    mt,
    mx,
    my,
    border,
    flex,
    items,
    justify,
    gap,
    grid,
    shadow
  })}
>
  <slot />
</div>
