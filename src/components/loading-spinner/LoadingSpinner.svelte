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
    display: 'inline-block',
    position: 'relative',
    width: '80px',
    height: '80px',
    div: {
      boxSizing: 'border-box',
      display: 'block',
      position: 'absolute',
      width: '64px',
      height: '64px',
      margin: '8px',
      border: '8px solid #fff',
      borderRadius: 50,
      animation: `${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
      borderColor: '$primary transparent transparent transparent'
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
