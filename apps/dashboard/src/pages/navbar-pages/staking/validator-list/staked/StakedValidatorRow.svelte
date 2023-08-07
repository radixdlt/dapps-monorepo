<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import ValidatorRow from '../ValidatorRow.svelte'
  import StakingInfo from './StakingInfo.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakingIcon from '@icons/staking.svg'

  export let validator: ComponentProps<ValidatorRow>['validator']
  export let nbrOfColumns: number
</script>

<tr class="validator-row">
  <ValidatorRow {validator} on:click>
    <IconNew icon={StakingIcon} --size="2.5rem" slot="icon" />
  </ValidatorRow>
</tr>

<td colspan={nbrOfColumns} class="staking-info">
  <StakingInfo {validator} on:claim-validator />
</td>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';
  .validator-row {
    display: contents;

    :global(.table-row) {
      &:hover {
        box-shadow: var(--shadow);
      }
    }

    :global(td) {
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border-bottom: none !important;
    }
  }

  .staking-info {
    @include mixins.mobile {
      display: none;
    }
  }
</style>
