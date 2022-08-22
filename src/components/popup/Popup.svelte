<script lang="ts">
  import { css } from '@styles'

  const popup = css({
    position: 'fixed',
    width: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 500ms',
    backgroundColor: '$grey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$lg',
    padding: '$sm',
    borderStyle: 'solid',
    borderColor: '$info'
  })
</script>

<div class={popup()}>
  <slot />
</div>
