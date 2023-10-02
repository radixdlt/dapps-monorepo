<script lang="ts">
  import { goto } from '$app/navigation'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'

  let component: HTMLTextAreaElement
  const adjustHeight = () => {
    component.style.height = ''
    component.style.height = component.scrollHeight + 'px'
  }

  let transactionManifest = ''
</script>

<div class="description">
  <div>
    Enter transaction manifest text here and send it as a transaction request to
    your Radix Wallet.
  </div>
  <div>
    Note: <strong
      >Do not include <a
        href="https://docs-babylon.radixdlt.com/main/transaction-manifest/conforming-types.html#_wallet_unacceptable_manifests"
        target="_blank"
      >
        reserved instructions</a
      > like “lock_fee”</strong
    > - your transaction will be rejected by the wallet. The wallet must add these
    instructions itself according to user preferences.
  </div>
</div>
<div class="card">
  <textarea
    bind:this={component}
    on:input={adjustHeight}
    bind:value={transactionManifest}
    placeholder="Enter a raw transaction manifest"
    rows="20"
  />
</div>

<SendTxButton
  on:click={(e) => {
    e.detail(transactionManifest)
  }}
  on:response={(e) => {
    goto(`/transaction-manifest/success?txID=${e.detail.transactionIntentHash}`)
  }}
  buttonProps={{ size: 'big' }}
/>

<style lang="scss">
  .card {
    margin-top: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .description {
    div {
      margin-bottom: 0.5rem;
    }
  }

  textarea {
    border-radius: var(--border-radius-lg);
    background: var(--background);
    border: 0;
    width: 100%;
    padding: var(--spacing-xl);
    outline: none;
    resize: vertical;
  }
</style>
