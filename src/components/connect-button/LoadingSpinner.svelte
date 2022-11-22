<script lang="ts">
  import { css, keyframes } from '@styles'

  const rotate = keyframes({
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  })

  const spinnerColor = css({
    position: 'relative',
    width: '$sm',
    height: '$sm',
    div: {
      boxSizing: 'border-box',
      display: 'block',
      position: 'absolute',
      left: '26px',
      width: '$sm',
      height: '$sm',
      border: '2px solid #fff',
      borderRadius: 30,
      animation: `${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
      borderColor: 'white transparent transparent transparent'
    },
    'div:nth-child(1)': {
      animationDelay: '-0.45s'
    },
    'div:nth-child(2)': {
      animationDelay: '-0.3s'
    },
    'div:nth-child(3)': {
      animationDelay: '-0.15s'
    }
  })
</script>

<div class={spinnerColor()}>
  <div />
  <div />
  <div />
  <div />
</div>
