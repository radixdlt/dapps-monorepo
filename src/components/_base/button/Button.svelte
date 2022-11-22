<script lang="ts">
  import { css } from '@styles'

  const variants = {
    connected: {
      true: {
        background: "url('/images/bg-connect-button.png') no-repeat",
        backgroundSize: 'cover',
        backgroundColor: '$connectButton'
      }
    },
    connectButton: {
      true: {
        borderRadius: '$lg',
        backgroundColor: '$connectButton'
      }
    },
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
    active: {
      true: {
        backgroundColor: '$primary',
        color: '$primaryButtonText',
        '&:hover': {
          backgroundColor: '$primary'
        }
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

  export let full: true | false = false
  export let size: keyof typeof variants['size'] | undefined = undefined
  export let border: keyof typeof variants['border'] | undefined = undefined
  export let ghost: true | false = false
  export let disabled: true | false = false
  export let active: true | false = false
  export let connectButton: true | false = false
  export let connected: true | false = false

  const btn = css({
    display: 'inline-flex',
    backgroundColor: '$primaryButton',
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
      backgroundColor: '$primaryButtonHover'
    },
    variants
  })
  const btnClass = btn({
    active,
    full,
    size,
    border,
    ghost,
    connectButton,
    connected
  })
  const disabledClass = css({
    backgroundColor: '$primaryButtonDisabled',
    color: '$grey',
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: '$primaryButtonDisabled'
    }
  })()
  const disabledBtnClass = `${btnClass} ${disabledClass}`
</script>

<button
  {...$$restProps}
  {disabled}
  on:click
  class={disabled ? disabledBtnClass : btnClass}
>
  <slot />
</button>
