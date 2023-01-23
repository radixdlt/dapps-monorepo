<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { css } from '@styles'
  import Box from '../box/Box.svelte'

  type G = $$Generic

  type T = G & { label: string }

  export let options: T[]
  export let selected: G[] = []
  export let loading = false

  const inputStyle = css({
    appearance: 'none',
    width: '$xs',
    height: '$xs',
    border: '0.1em solid $muted',
    marginRight: '$sm',
    marginTop: '$md',
    transform: 'translateY(0.15em)',
    '&:checked': {
      backgroundColor: '$secondary'
    }
  })()
</script>

<Box wrapper flex="col">
  {#if loading}
    <SkeletonLoader count={5} />
  {/if}
  {#each options as option}
    <label>
      <input
        class={inputStyle}
        type="checkbox"
        bind:group={selected}
        value={option}
      />
      <slot label={option.label}>
        {option.label}
      </slot>
    </label>
  {/each}
</Box>
