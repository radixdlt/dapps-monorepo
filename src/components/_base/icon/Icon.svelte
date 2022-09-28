<script lang="ts">
  import type { CSS } from '@stitches/core'

  import type { config } from '@styles'

  import Image from '../image/Image.svelte'

  export let isActive = false
  export let type: string
  export let interactive: boolean | undefined = undefined

  const style: CSS<typeof config> = {
    width: '$sm',
    height: '$sm',
    cursor: interactive ? 'pointer' : 'default',
    filter: !isActive ? 'grayscale(100%)' : '',
    '&:active': {
      filter: 'grayscale(100%)'
    },
    '&:hover': {
      filter: '$iconHover'
    }
  }
</script>

<Image cx={style} width="$sm" height="$sm" alt="dashboard" src={type} />
