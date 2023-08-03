<script lang="ts">
  import Icon from '@components/_base/icon/Icon.svelte'

  export let bold: boolean
  export let icon: string
  export let interactiveIcon: boolean = false
  export let iconSize: 'xs' | 'sm' | 'md' | 'lg' = 'sm'
  export let isIconColor: boolean = false
  export let iconPosition: 'left' | 'right' = 'left'

  const iconProps = {
    filter: !isIconColor ? 'grayscale(100%)' : 'undefined',
    icon: icon,
    height: iconSize,
    width: iconSize,
    interactive: interactiveIcon
  }
</script>

<div class="icon-text-item">
  {#if iconPosition === 'left'}
    <Icon on:click {...iconProps} />
  {/if}
  <span class:bold><slot /></span>
  {#if iconPosition === 'right'}
    <Icon on:click {...iconProps} />
  {/if}
</div>

<style>
  .icon-text-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--text-sm);
  }

  .bold {
    font-weight: var(--font-weight-bold-3);
  }
</style>
