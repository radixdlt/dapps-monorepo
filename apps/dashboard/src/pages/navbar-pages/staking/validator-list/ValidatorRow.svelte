<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import ResponsiveTableCell from '@components/_base/table/basic-table/ResponsiveTableCell.svelte'
  import TableRow from '@components/_base/table/basic-table/TableRow.svelte'
  import StakeDisplay from './StakeDisplay.svelte'
  import { truncateNumber } from '@utils'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import type { Validator } from '../Validators.svelte'
  import { connected } from '@stores'

  export let validator: Validator
</script>

<tr class="validator-row">
  <TableRow on:click>
    {#if $connected}
      <ResponsiveTableCell width="5rem">
        <div slot="no-padding-content" class="left-padded center">
          <slot name="icon" />
        </div>
      </ResponsiveTableCell>
    {/if}

    <ResponsiveTableCell>
      <div class:left-padded={!$connected}>
        {validator.name}
      </div>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <Address
        short
        value={validator.address}
        --background="var(--theme-surface-1)"
      />
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <div class="center">
        <StakeDisplay stakeInfo={Promise.resolve(validator)} />
      </div>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <div class="center bold">
        {truncateNumber(validator.percentageOwnerStake)}%
      </div>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <svelte:fragment slot="no-padding-content">
        <div class="apy apy-text-box no-overflow bold">
          {truncateNumber(validator.apy)}%
          <span class="subtext">per year</span>
        </div>
      </svelte:fragment>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <svelte:fragment slot="no-padding-content">
        <div class="apy-text-box no-overflow bold">
          {truncateNumber(validator.fee)}%
        </div>
      </svelte:fragment>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <svelte:fragment slot="no-padding-content">
        <div class="uptime apy-text-box no-overflow bold">
          {truncateNumber(validator.uptime)}%
        </div>
      </svelte:fragment>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <div class="accepts-stake">
        <AcceptsStake value={validator.acceptsStake} />
      </div>
    </ResponsiveTableCell>

    {#if $connected}
      <ResponsiveTableCell>
        <div class="select">
          <SelectValidator
            validator={Promise.resolve(validator)}
            text="SELECT"
          />
        </div>
      </ResponsiveTableCell>
    {/if}
  </TableRow>
</tr>

<style>
  .validator-row {
    display: contents;
    cursor: pointer;
  }

  .bold {
    font-weight: var(--font-weight-bold-1);
  }

  .center {
    display: flex;
    justify-content: center;
  }

  .left-padded {
    padding-left: var(--spacing-lg);
  }

  .no-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .apy {
    border-radius: var(--border-radius-lg) 0 0 var(--border-radius-lg);
    background: var(--theme-surface-1);
    min-width: 10rem;
  }

  .apy-text-box {
    border: 1px solid #e2e5ed;
    text-align: center;
    padding: var(--spacing-sm) var(--spacing-xl);
  }

  .uptime {
    border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
  }

  .accepts-stake {
    display: flex;
    justify-content: center;
  }

  .select {
    padding-right: var(--spacing-lg);
  }
</style>
