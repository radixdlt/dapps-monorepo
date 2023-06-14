<script lang="ts">
  import type { CSS } from '@stitches/core'
  import type { config } from '@styles'
  import { icons } from '../../../../src/icon-assets'
  import Image from '../image/Image.svelte'

  export let type: keyof typeof icons
  export let filter: string = 'grayscale(100%)'
  export let interactive: boolean | undefined = undefined
  export let height: keyof (typeof config)['theme']['sizes'] = 'sm'
  export let width: keyof (typeof config)['theme']['sizes'] = 'sm'

  const style: CSS<typeof config> = {
    width: `$${width}`,
    height: `$${height}`,
    cursor: interactive ? 'pointer' : 'default',
    filter,
    '&:active': {
      filter: 'grayscale(100%)'
    },
    '&:hover': {
      filter: interactive ? '$iconHover' : ''
    }
  }
</script>

<Image
  on:click
  cx={style}
  width="$sm"
  height="$sm"
  alt="dashboard"
  src={icons[type]}
/>
