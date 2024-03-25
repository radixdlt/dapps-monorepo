<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import PendingIcon from '@icons/pending.svg'
  import CrossRed from '@icons/cross-red.svg'

  export let message: string
  export let type: 'default' | 'warning' | 'error' = 'default'
</script>

<div class="info-bar {type}">
  {#if type === 'warning'}
    <IconNew icon={PendingIcon} />
  {:else if type === 'error'}
    <IconNew icon={CrossRed} />
  {/if}
  <span>{message}</span>
</div>

<style lang="scss">
  .info-bar {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    font-weight: var(--font-weight-bold-1);

    &.error {
      background: var(--color-radix-error-red-2);
      color: var(--color-radix-error-red-1);
    }

    &.warning {
      color: var(--color-alert-1);
      background: #fffcf5;
    }

    &.default {
      border: 1px solid var(--color-grey-4);
    }
  }
</style>
