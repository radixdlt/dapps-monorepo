<script lang="ts">
  import { css, config } from '@styles'
  import Box from '../box/Box.svelte'
  import Icon from '../icon/Icon.svelte'

  export let onSearch: (address: string) => void
  export let placeholder: string = ''

  let value: string = ''

  const iconHeight: keyof typeof config['theme']['sizes'] = 'sm'

  const search = css({
    color: '$onSurface',
    border: 'none',
    borderRadius: '$searchBorder',
    py: '$md',
    px: '$lg',
    paddingRight: '$4xl',
    shadow: true,
    width: '100%'
  })()
</script>

<form on:submit|preventDefault={() => onSearch(value)}>
  <Box full cx={{ position: 'relative' }} wrapper inline>
    <input bind:value class={search} {placeholder} type="text" />
    <Box
      wrapper
      cx={{
        position: 'absolute',
        top: `calc(50% - ${config['theme']['sizes'][iconHeight]} / 2)`,
        right: 20
      }}
    >
      <Icon
        on:click={() => onSearch(value)}
        interactive
        type={'search'}
        height={iconHeight}
      />
    </Box>
  </Box>
</form>
