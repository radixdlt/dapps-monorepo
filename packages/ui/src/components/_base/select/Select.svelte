<script lang="ts" context="module">
  export type Option<T> = {
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
  import Text from '../text/Text.svelte'
  import LoadingSpinner from '../button/loading-spinner/LoadingSpinner.svelte'
  import ListboxChevronIcon from '@icons/listbox-chevron.svg'

  type T = $$Generic
  export let options: Array<Option<T>> = []
  export let placeholder: string | undefined = undefined
  export let placeholderWhenEmpty: string = ''
  export let selected: Option<T> | undefined = undefined
  export let loading = false

  $: selected = placeholder
    ? undefined
    : options.find((option) => !option.unavailable)

  const onSelect = (e: CustomEvent<Option<T>>) => {
    selected = e.detail
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
    },
    '&:hover div': {
      color: 'white'
    }
  })

  const listboxoptionsStyles = css({
    position: 'absolute',
    zIndex: 100,
    right: 0,
    left: 0,
    p: '$0',
    mt: '$xs',
    py: '$xs',
    listStyle: 'none',
    borderRadius: '$md',
    shadow: true
  })

  const listboxStyles = css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    cursor: 'pointer',
    position: 'relative',
    color: 'inherit',
    height: '36px',
    py: '$xs',
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
      content: `url(${ListboxChevronIcon})`,
      width: '18px',
      height: '18px',
      position: 'absolute',
      right: '$sm'
    }
  })
</script>

<Listbox value={selected} on:change={onSelect}>
  <div style:position="relative">
    <ListboxButton class={listboxStyles()}>
      {#if loading}
        <div
          style:display="inline-block"
          style:width="100%"
          style:height="100%"
          style:text-align="center"
        >
          <div
            style:height="100%"
            style:aspect-ratio="1 / 1"
            style:display="inline-block"
          >
            <LoadingSpinner />
          </div>
        </div>
      {:else}
        {selected?.label ?? placeholder ?? placeholderWhenEmpty}
      {/if}
    </ListboxButton>
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
  </div>
</Listbox>
