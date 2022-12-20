<script lang="ts" context="module">
  export type Options<T> = {
    label: string
    unavailable?: boolean
  } & T
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

  type T = $$Generic
  export let options: Array<Options<T>> = []

  export let placeholder: string | undefined = undefined

  export let handleSelect: (option: Options<T>) => void = () => {}

  let selected: Options<T> | undefined = placeholder ? undefined : options[0]

  const onSelect = (e: CustomEvent<Options<T>>) => {
    selected = e.detail
    handleSelect(e.detail)
  }

  const listboxoptionStyle = css({
    px: '$md',
    py: '$sm',
    fontSize: '$xs',
    backgroundColor: '$surface',
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
    shadow: true
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
    backgroundColor: '$background',
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
    <ListboxButton class={listboxStyles()}
      >{selected?.label ?? placeholder}</ListboxButton
    >
    <ListboxOptions class={listboxoptionsStyles}>
      {#each options as item}
        <ListboxOption
          class={listboxoptionStyle}
          value={item}
          disabled={item.unavailable}
        >
          <Text bold={item.label === selected?.label}>{item.label}</Text>
        </ListboxOption>
      {/each}
    </ListboxOptions>
  </Box>
</Listbox>
