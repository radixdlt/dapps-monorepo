<script lang="ts">
  import { css, config } from '@styles'
  import Box from '../box/Box.svelte'
  import Icon from '../icon/Icon.svelte'
  import SearchIcon from '@icons/search_icon.svg'

  export let onSearch: (address: string) => void
  export let placeholder: string = ''

  let value: string = ''

  const iconHeight: keyof (typeof config)['theme']['sizes'] = 'sm'

  const search = () => {
    onSearch(value)
    value = ''
  }

  const style = css({
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

<form on:submit|preventDefault={search}>
  <Box bgColor="surface" full cx={{ position: 'relative' }} wrapper inline>
    <input bind:value class={style} {placeholder} type="text" />
    <Box
      bgColor="surface"
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
        icon={SearchIcon}
        height={iconHeight}
      />
    </Box>
  </Box>
</form>
