<script lang="ts">
  import { selectedAccount } from '@stores'

  import { css } from '@styles'
  import type { Validators } from '@types'
  import { shortenAddress } from '@utils'
  import Input from '../input/Input.svelte'

  export let validators: Validators

  const baseColumns = '200px 1fr 2.5fr 2fr 1fr 1.5fr 2fr 1fr'

  const validatorList = css({
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: baseColumns,
    rowGap: 15,
    columnGap: 10,
    '*': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  })

  const addedColumns = css({
    gridTemplateColumns: `1fr 1fr ${baseColumns}`
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

<div class={`${validatorList()} ${$selectedAccount ? addedColumns() : ''}`}>
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

  {#each filteredValidators as validator}
    {#if $selectedAccount}
      <input type="checkbox" />
      <div>0</div>
    {/if}
    {#each [validator.name, validator.stakeAccepted, `${validator.totalStake} (${validator.stakePercentage}%)`, `${validator.ownerStake} (${validator.ownerStakePercentage}%)`, validator.feePercentage, validator.uptimePercentage, shortenAddress(validator.address), '...'] as text}
      <div>{text}</div>
    {/each}
  {/each}
</div>
