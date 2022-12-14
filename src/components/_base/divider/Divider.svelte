<script lang="ts">
  import { css } from '@styles'

  const variants = {
    color: {
      border: {
        borderColor: '$borderColor'
      }
    }
  }

  const style = css({
    borderRadius: '$sm',
    borderTop: '1px solid',
    variants
  })

  export let color: keyof typeof variants['color'] | undefined = undefined
</script>

<hr class={style({ color })} />
