<script lang="ts">
  import Validator from './Validator.svelte'
  import { selectedAccount } from '@stores'
  import { css } from '@styles'
  import type { Stakes, Validators } from '@types'
  import Input from '../input/Input.svelte'

  export let validators: Validators
  export let stakes: Stakes | undefined = undefined
  export let selectedValidators: (Validators[0] | undefined)[] = []

  $: validatorList = css({
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: `${
      $selectedAccount ? '1fr 1fr' : ''
    } 200px 1fr 2.5fr 2fr 1fr 1.5fr 2fr 1fr`,
    rowGap: 15,
    columnGap: 10,
    '*': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  })

  const filterBtn = css({
    width: 'max-content',
    padding: '$sm $md',
    border: 'none',
    borderRadius: '$sm'
  })

  const header = css({
    alignSelf: 'center'
  })

  let filteredValidators: Validators

  let searchName: string
  let searchAddress: string

  let filterStake: boolean
  const filterStakeThreshold = 3

  let filterOwnerStake: boolean
  const filterOwnerStakeThreshold = 10

  let filterFee: boolean
  const filterFeeThreshold = 5

  let filterUptime: boolean
  const filterUptimeThreshold = 99

  const includesName = (name: string) =>
    searchName ? name.toLowerCase().includes(searchName.toLowerCase()) : true

  const includesAddress = (address: string) =>
    searchAddress ? address.includes(searchAddress) : true

  const filteredByStake = (stakePercentage: number) =>
    filterStake ? stakePercentage > filterStakeThreshold : false

  const filteredByOwnerStake = (ownerStakePercentage: number) =>
    filterOwnerStake ? ownerStakePercentage < filterOwnerStakeThreshold : false

  const filteredByFee = (fee: number) =>
    filterFee ? fee > filterFeeThreshold : false

  const filteredByUptime = (uptime: number) =>
    filterUptime ? uptime < filterUptimeThreshold : false

  $: {
    searchName
    searchAddress
    filterStake
    filterOwnerStake
    filterFee
    filterUptime

    filteredValidators = validators.filter(
      (validator) =>
        includesName(validator.name) &&
        includesAddress(validator.address) &&
        !filteredByStake(validator.stakePercentage) &&
        !filteredByOwnerStake(validator.ownerStakePercentage) &&
        !filteredByFee(validator.feePercentage) &&
        !filteredByUptime(validator.uptimePercentage)
    )
  }
</script>

<div class={validatorList()}>
  {#if $selectedAccount}
    <div />
    <div class={header()}>My Stakes</div>
  {/if}
  <div class={header()}>
    <Input bind:value={searchName} placeholder="Search by name" />
  </div>
  <div class={header()}>ADS</div>
  <button
    on:click={() => (filterStake = !filterStake)}
    class={`${filterBtn()} ${header()}`}
  >
    <input type="checkbox" bind:checked={filterStake} />{' Stake < 3%'}
  </button>
  <button
    on:click={() => (filterOwnerStake = !filterOwnerStake)}
    class={`${filterBtn()} ${header()}`}
  >
    <input
      type="checkbox"
      bind:checked={filterOwnerStake}
    />{' Owner Stake > 10%'}
  </button>
  <button
    on:click={() => (filterFee = !filterFee)}
    class={`${filterBtn()} ${header()}`}
  >
    <input type="checkbox" bind:checked={filterFee} />{' Fee < 5%'}
  </button>
  <button
    on:click={() => (filterUptime = !filterUptime)}
    class={`${filterBtn()} ${header()}`}
  >
    <input type="checkbox" bind:checked={filterUptime} />{' Uptime > 99%'}
  </button>
  <div class={header()}>
    <Input bind:value={searchAddress} placeholder="Search by address" />
  </div>
  <div class={header()} />

  {#each filteredValidators as validator, index}
    <Validator
      name={validator.name}
      stakeAccepted={validator.stakeAccepted}
      totalStake={validator.totalStake}
      stakePercentage={validator.stakePercentage}
      ownerStake={validator.ownerStake}
      ownerStakePercentage={validator.ownerStakePercentage}
      feePercentage={validator.feePercentage}
      uptimePercentage={validator.uptimePercentage}
      address={validator.address}
      stakes={{
        stake: stakes?.stakes[validator.address],
        pendingStake: stakes?.pendingStakes[validator.address]
      }}
      on:change={() =>
        (selectedValidators[index] = selectedValidators[index]
          ? undefined
          : validator)}
    />
  {/each}
</div>
