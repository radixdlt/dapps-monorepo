<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import ResponsiveTableCell from '@components/_base/table/basic-table/ResponsiveTableCell.svelte'
  import TableRow from '@components/_base/table/basic-table/TableRow.svelte'
  import StakeDisplay from './StakeDisplay.svelte'
  import { truncateNumber } from '@utils'
  import AcceptsStake from '../accepts-stake/AcceptsStake.svelte'
  import SelectValidator from '../select-validator/SelectValidator.svelte'
  import type { Validator } from '../Validators.svelte'

  export let validator: Validator
</script>

<tr class="validator-row">
  <TableRow on:click>
    <ResponsiveTableCell />

    <ResponsiveTableCell>
      {validator.name}
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <Address
        short
        value={validator.address}
        --background="var(--theme-surface-1)"
      />
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <StakeDisplay stakeInfo={Promise.resolve(validator)} />
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      {truncateNumber(validator.percentageOwnerStake)}%
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <div class="apy">
        {truncateNumber(validator.apy)}%
      </div>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <div class="fee">
        {truncateNumber(validator.fee)}%
      </div>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <div class="uptime">
        {truncateNumber(validator.uptime)}%
      </div>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <div class="accepts-stake">
        <AcceptsStake value={validator.acceptsStake} />
      </div>
    </ResponsiveTableCell>

    <ResponsiveTableCell>
      <SelectValidator validator={Promise.resolve(validator)} text="SELECT" />
    </ResponsiveTableCell>
  </TableRow>
</tr>

<style>
  .validator-row {
    display: contents;
    cursor: pointer;
  }

  .apy {
    border-radius: var(--border-radius-lg) 0 0 var(--border-radius-lg);
    background: var(--theme-surface-1);
    min-width: 10rem;
  }

  .apy,
  .fee,
  .uptime {
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
</style>
