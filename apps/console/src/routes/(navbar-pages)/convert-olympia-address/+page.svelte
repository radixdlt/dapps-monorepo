<script lang="ts">
  import Box from '@svelte-ui/components/_base/box/Box.svelte'
  import LoadingSpinner from '@svelte-ui/components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import Text from '@svelte-ui/components/_base/text/Text.svelte'
  import Button from '@svelte-ui/components/_base/button/Button.svelte'
  import { writable } from 'svelte/store'
  import { convertOlympiaToBabylonAddress } from './side-effects'
  import Address from '@svelte-ui/components/_base/address/Address.svelte'
  import { CURRENT_NETWORK } from '../../../network'
  const olympiaAddress = writable('')
  const babylonAddress = writable('')
  const loading = writable(false)

  const convertAddress = () => {
    babylonAddress.set('')
    loading.set(true)
    convertOlympiaToBabylonAddress($olympiaAddress).then((address) => {
      babylonAddress.set(address)
      loading.set(false)
    })
  }
</script>

<Box>
  <Text inline size="xxlarge" mb="medium" bold>Convert Olympia Address</Text>

  <div class="card">
    <div class="content">
      <input
        on:input
        type="text"
        bind:value={$olympiaAddress}
        placeholder="Olympia Address"
      />
      <Button on:click={convertAddress} disabled={!$olympiaAddress}>
        {#if $loading}
          <div style:height="60%" style:aspect-ratio="1/1">
            <LoadingSpinner />
          </div>
        {:else}
          Convert
        {/if}
      </Button>
    </div>
    {#if $babylonAddress}
      <div class="babylon-content">
        <Text size="medium">Babylon address</Text>
        <Address
          includeDashboardHost={true}
          currentNetworkId={CURRENT_NETWORK.id}
          value={$babylonAddress}
          short={false}
          --background="var(--theme-surface-3)"
        />
      </div>
    {/if}
  </div>
</Box>

<style lang="scss">
  .card {
    margin-top: 1rem;
    padding: 2rem;
    margin-bottom: 1rem;
  }
  .content,
  .babylon-content {
    display: flex;
    gap: 1rem;
  }
  .babylon-content {
    margin-top: var(--space-lg);
    flex-wrap: wrap;
  }
  input {
    background-color: var(--theme-surface-1);
    border: none;
    padding: 0.5rem;
    width: 100%;
    border-bottom: 1px solid var(--theme-surface-3);
  }
</style>
