<script lang="ts">
  import { goto } from '$app/navigation'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import CardRow from '@components/info-box/CardRow.svelte'
  import { addressToRoute } from '@utils'

  export let cardInfo: { iconUrl: string; text: string; address: string }[]

  const goToAddress = (address: string) => async () => {
    goto(await addressToRoute(address))
  }
</script>

<CardRow title="Associated Dapps">
  <div class="cards">
    {#each cardInfo as { iconUrl, text, address }}
      <div
        class="card dapp-card"
        on:click={goToAddress(address)}
        on:keypress={goToAddress(address)}
      >
        <NftImage url={iconUrl} />

        <span class="card-text dotted-overflow">{text}</span>
      </div>
    {/each}
  </div>
</CardRow>

<style lang="scss">
  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-lg);

    .dapp-card {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: var(--spacing-xl);
      gap: var(--spacing-lg);
      width: 15rem;

      @include mixins.mobile {
        margin: auto;
      }

      .card-text {
        font-weight: var(--font-weight-bold-2);
      }
    }
  }
</style>
