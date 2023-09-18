<script lang="ts">
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import CardRow from '@components/info-box/CardRow.svelte'

  export let tokens: {
    iconUrl?: string
    name?: string
  }[]
</script>

<CardRow title="Redeemable Tokens">
  <div class="redeemable-tokens">
    {#each tokens as token}
      <div class="pool-token row card">
        <div class="icon-and-name">
          <TokenIcon iconUrl={token.iconUrl} />
          {token.name}
        </div>
      </div>
    {/each}
  </div>
</CardRow>

<style>
  .redeemable-tokens {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 15rem;
  }

  .pool-token {
    display: flex;
    justify-content: space-between;

    &:first-child {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:not(:last-child) &:not(:first-child) {
      border-radius: 0;
    }

    &:last-child {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .icon-and-name {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .row {
    align-items: center;
    padding: var(--spacing-xl);
  }
</style>
