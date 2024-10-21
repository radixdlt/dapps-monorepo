<script lang="ts">
  import type {
    StreamTransactionsRequestEventFilterItem,
    StreamTransactionsRequestEventFilterItemEventEnum
  } from '@radixdlt/babylon-gateway-api-sdk'
  import FilterCard from './FilterCard.svelte'
  import InputNew from '@components/_base/input/InputNew.svelte'
  import SimplePicker from '@components/_base/picker/simple-picker/SimplePicker.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import { shortenAddress } from '@utils'

  export let title: string
  export let description: string
  export let events: StreamTransactionsRequestEventFilterItem[] = []

  let emitterAddress = ''
  let resourceAddress = ''

  let selected: {
    label: string
    value: StreamTransactionsRequestEventFilterItemEventEnum
  }
</script>

<FilterCard
  {title}
  {description}
  appliedFilters={events.map(
    (event) =>
      `${event.event} ${shortenAddress(event.emitter_address)} ${shortenAddress(
        event.resource_address
      )}`
  )}
>
  <div class="input">
    <SimplePicker
      bind:selected
      options={[
        {
          label: 'Withdrawal',
          value: 'Withdrawal',
          default: true
        },
        {
          label: 'Deposit',
          value: 'Deposit'
        }
      ]}
    />

    <div class="textinput">
      <InputNew border bind:value={emitterAddress} placeholder="Emitter" />
    </div>

    <div class="textinput">
      <InputNew border bind:value={resourceAddress} placeholder="Resource" />
    </div>
  </div>
  <div>
    <div class="buttons">
      <ButtonNew
        on:click={() => {
          events = [
            ...events,
            {
              event: selected.value,
              emitter_address: emitterAddress,
              resource_address: resourceAddress
            }
          ]
          emitterAddress = ''
          resourceAddress = ''
        }}
      >
        Add
      </ButtonNew>

      <ButtonNew
        on:click={() => {
          events = []
        }}>Clear All</ButtonNew
      >
    </div>
  </div>
</FilterCard>

<style lang="scss">
  .input {
    display: flex;
    margin: var(--spacing-xl) 0;
    gap: var(--spacing-xl);
  }

  .buttons {
    display: flex;
    gap: var(--spacing-md);
  }
</style>
