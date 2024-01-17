<script lang="ts">
  import ExternalLink from '@icons/external.svg'
  import IconNew from '@svelte-ui/components/_base/icon/IconNew.svelte'
  import Button from '@svelte-ui/components/_base/button/ButtonNew.svelte'
  import LoadingSpinner from '@svelte-ui/components/_base/button/loading-spinner/LoadingSpinner.svelte'

  export let disabled = false
  export let loading = false
</script>

<Button {disabled} on:click size="big">
  {#if loading}
    <div style:height="60%" style:aspect-ratio="1/1">
      <LoadingSpinner />
    </div>
  {:else}
    <div class="button-text">
      Send to the Radix Wallet
      <IconNew icon={ExternalLink} size="small" />
    </div>
  {/if}
</Button>

<style>
  .button-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    color: var(--color-light);
    font-weight: var(--font-weight-bold-2);
  }
</style>
