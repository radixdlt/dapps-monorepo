<script lang="ts" context="module">
  export type Options = {
    id: string
    label: string
    unavailable?: boolean
  }
</script>

<script lang="ts">
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
  } from '@rgossiaux/svelte-headlessui'

  import { css } from '@styles'
  import Box from '../box/Box.svelte'
  import Text from '../text/Text.svelte'

  export let options: Options[] = []

  export let selected: Options

  export let handleSelect: (option: typeof selected) => void = () => {}

  const onSelect = (e: CustomEvent<typeof selected>) => {
    handleSelect(e.detail)
  }

  const listboxoptionStyle = css({
    px: '$md',
    py: '$sm',
    fontSize: '$xs',
    '&:hover': {
      backgroundColor: '$primaryButtonHover',
      color: 'white',
      cursor: 'pointer'
    }
  })

  const listboxoptionsStyles = css({
    position: 'absolute',
    zIndex: 100,
    right: 0,
    left: 0,
    mt: '$xs',
    py: '$xs',
    listStyle: 'none',
    borderRadius: '$md',
    shadow: true,
    backgroundColor: '$surface'
  })

  const listboxStyles = css({
    width: '100%',
    cursor: 'pointer',
    position: 'relative',
    color: 'inherit',
    py: '$sm',
    px: '$md',
    textAlign: 'left',
    fontWeight: '$600',
    backgroundColor: '$transparent',
    borderRadius: '$lg',
    border: '1px solid $borderColor',
    '&:hover': {
      borderColor: '$borderColorHover'
    },
    '&:after': {
      content: "url('/icons/listbox-chevron.svg')",
      width: '18px',
      height: '18px',
      position: 'absolute',
      right: '$sm'
    }
  })
</script>

<Listbox value={selected} on:change={onSelect}>
  <Box px="none" py="none" cx={{ position: 'relative' }}>
    <ListboxButton class={listboxStyles()}>{selected.label}</ListboxButton>
    <ListboxOptions class={listboxoptionsStyles}>
      {#each options as item (item.id)}
        <ListboxOption
          class={listboxoptionStyle}
          value={item}
          disabled={item.unavailable}
        >
          <Text bold={item.label === selected.label}>{item.label}</Text>
        </ListboxOption>
      {/each}
    </ListboxOptions>
  </Box>
</Listbox>
