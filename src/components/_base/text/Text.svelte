<script lang="ts">
  import { css } from '../../../styles'

  const variants = {
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
    color: {
      primary: {
        color: '$primary'
      },
      secondary: {
        color: '$secondary'
      },
      tertiary: {
        color: '$tertiary'
      }
    },
    muted: {
      true: {
        color: '$muted'
      }
    },
    size: {
      xsmall: {
        fontSize: '$xs'
      },
      small: {
        fontSize: '$sm'
      },
      medium: {
        fontSize: '$md'
      },
      large: {
        fontSize: '$lg'
      },
      xlarge: {
        fontSize: '$xl'
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
  export let mt: keyof typeof variants['mt'] | undefined = undefined
  export let color: keyof typeof variants['color'] | undefined = undefined
  export let size: keyof typeof variants['size'] | undefined = undefined
  export let muted: true | false = false

  const text = css({
    variants
  })
</script>

<div
  class={text({
    full,
    pointer,
    interactive,
    p,
    px,
    py,
    m,
    mt,
    mx,
    my,
    color,
    size,
    muted
  })}
>
  <slot />
</div>
