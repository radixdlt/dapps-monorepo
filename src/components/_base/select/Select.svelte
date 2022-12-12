<script lang="ts">
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
  } from '@rgossiaux/svelte-headlessui'

  import { css } from '@styles'
  import Text from '../text/Text.svelte'

  export let options: Array<{
    label: string
    id: string
    unavailable: boolean
  }> = []

  export let selected: {
    label: string
    id: string
    unavailable: boolean
  } = options[0]

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
</Listbox>
