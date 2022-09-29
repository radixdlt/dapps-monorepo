<script lang="ts">
  import { css } from '@styles'

  const variants = {
    full: {
      true: {
        width: '$1'
      }
    },
    size: {
      small: {
        padding: '$sm $xl',
        fontSize: '$sm'
      },
      iconSmall: {
        padding: '$xs',
        fontSize: '0'
      }
    },
    border: {
      none: {
        borderWidth: '0'
      }
    },
    ghost: {
      true: {
        backgroundColor: '$primaryGhostButton',
        color: '$primaryGhostButtonText',
        '&:hover': {
          backgroundColor: '$primaryGhostButtonHover',
          color: '$primaryGhostButtonHoverText'
        }
      }
    }
  }

  export let full: keyof typeof variants['full'] | false = false
  export let size: keyof typeof variants['size'] | undefined = undefined
  export let border: keyof typeof variants['border'] | undefined = undefined
  export let ghost: true | false = false
  export let disabled = false

  $: btn = css({
    backgroundColor: disabled ? '$grey2' : '$primaryButton',
    borderWidth: '$sm',
    borderColor: '$borderColor',
    borderStyle: 'solid',
    cursor: 'pointer',
    borderRadius: '$sm',
    fontSize: '$md',
    color: '$primaryButtonText',
    padding: '$md $2xl',
    transition: 'color .2s,border-color .2s,background-color .2s',
    '&:hover': {
      backgroundColor: disabled ? '' : '$primaryButtonHover'
    },
    variants
  })
</script>

<button
  {...$$restProps}
  {disabled}
  on:click
  class={btn({ full, size, border, ghost })}
>
  <slot />
</button>
