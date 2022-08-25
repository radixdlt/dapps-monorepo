<script lang="ts">
  import { theme, css } from '../../styles'

  const variants = {
    full: {
      true: {
        width: '100%'
      }
    },
    pointer: {
      true: {
        cursor: 'pointer'
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
      }
    },
    position: {
      relative: {
        position: 'relative'
      },
      absolute: {
        position: 'absolute'
      }
    }
  } as const

  export let full: true | false = false
  export let pointer: true | false = false
  export let interactive: true | false = false
  export let p: keyof typeof variants['p'] | undefined = undefined
  export let m: keyof typeof variants['m'] | undefined = undefined
  export let py: keyof typeof variants['py'] | undefined = undefined
  export let px: keyof typeof variants['px'] | undefined = undefined
  export let my: keyof typeof variants['my'] | undefined = undefined
  export let mx: keyof typeof variants['mx'] | undefined = undefined
  export let border: keyof typeof variants['border'] | false = false
  export let flex: keyof typeof variants['flex'] | undefined = undefined
  export let items: keyof typeof variants['items'] | undefined = undefined
  export let justify: keyof typeof variants['justify'] | undefined = undefined

  export let background: keyof typeof theme['colors'] | 'transparent' =
    'transparent'

  const box = css({
    backgroundColor: `$${background}`,
    borderRadius: '$sm',
    p: '$md',
    variants
  })
</script>

<div
  class={box({
    full,
    pointer,
    interactive,
    p,
    px,
    py,
    m,
    mx,
    my,
    border,
    flex,
    items,
    justify
  })}
>
  <slot />
</div>
