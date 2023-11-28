<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import CheckMarkIcon from '@icons/checkmark.svg'
  import CrossIcon from '@icons/cross.svg'

  export let value: boolean | Promise<boolean>

  $: acceptsStake = Promise.resolve(value)
</script>

{#await acceptsStake}
  <SkeletonLoader width={20} />
{:then acceptsStake}
  {#if acceptsStake}
    <Icon size="medium" icon={CheckMarkIcon} />
  {:else}
    <div style:color="var(--color-alert-1)">
      <Icon size="medium" icon={CrossIcon} />
    </div>
  {/if}
{/await}
