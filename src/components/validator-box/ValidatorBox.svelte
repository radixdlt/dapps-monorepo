<script lang="ts">
  import Button from "@components/button/Button.svelte"

  import { css } from "@styles"
  import type { Validators } from "@types"
  import { shortenAddress } from "@utils"
  import Input from "../input/Input.svelte"

  export let validators: Validators

  const validatorBox = css({
    display: "grid",
    gridTemplateRows: "auto",
    gridTemplateColumns: "200px 1fr 2.5fr 2fr 1fr 1.5fr 2fr 1fr",
    rowGap: 15,
    columnGap: 10,
    "*": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  })

  const filterBtn = css({
    width: 'max-content',
    padding: '$sm $md',
    border: "none",
    borderRadius: "$sm"
  })

  const header = css({
    alignSelf: "center"
  })

  let filteredValidators: Validators

  let searchName: string
  let searchAddress: string

  const includesName = (name: string) =>
    searchName ? name.toLowerCase().includes(searchName.toLowerCase()) : true

  const includesAddress = (address: string) =>
    searchAddress ? address.includes(searchAddress) : true

  $: {
    searchName
    searchAddress

    filteredValidators = validators.filter(
      (validator) =>
        includesName(validator.properties.name) &&
        includesAddress(validator.validator_identifier.address)
    )
  }
</script>

<div class={validatorBox()}>
  <div class={header()}>
    <Input bind:value={searchName} placeholder="Search by name" />
  </div>
  <div class={header()}>ADS</div>
  <button class={`${filterBtn()} ${header()}`}>{"Stake < 3%"}</button>
  <button class={`${filterBtn()} ${header()}`}>{"Owner Stake > 10%"}</button>
  <button class={`${filterBtn()} ${header()}`}>{"Fee < 5%"}</button>
  <button class={`${filterBtn()} ${header()}`}>{"Uptime > 99%"}</button>
  <div class={header()}>
    <Input bind:value={searchAddress} placeholder="Search by address" />
  </div>
  <div class={header()} />

  {#each filteredValidators as validator}
    {#each [validator.properties.name, validator.properties.external_stake_accepted, `${validator.stake.value} (${validator.stakePercentage}%)`, validator.info.owner_stake.value, validator.properties.validator_fee_percentage, validator.info.uptime.uptime_percentage, shortenAddress(validator.validator_identifier.address), "..."] as text}
      <div>{text}</div>
    {/each}
  {/each}
</div>
