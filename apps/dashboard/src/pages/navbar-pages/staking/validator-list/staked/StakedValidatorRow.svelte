<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import ValidatorRow from '../ValidatorRow.svelte'
  import StakingInfo from './StakingInfo.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakingIcon from '@icons/staking.svg'

  export let input: ComponentProps<ValidatorRow>['input']
  export let columnIds: ComponentProps<ValidatorRow>['columnIds']
</script>

<div class="validator-row full-width">
  <ValidatorRow {input} {columnIds} on:click>
    <IconNew icon={StakingIcon} --size="2.5rem" slot="icon" />
  </ValidatorRow>

  <div class="staking-info full-width">
    <StakingInfo
      validator={input === 'loading'
        ? new Promise(() => {})
        : Promise.resolve(input.validator)}
      on:claim-validator
    />
  </div>
</div>

<style lang="scss">
  .validator-row {
    display: grid;
    grid-template-columns: subgrid;
    border-radius: var(--border-radius-lg);

    &:hover {
      box-shadow: var(--shadow-hover);
    }

    transition: var(--transition-hover-card);

    :global(.validator-row) {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;

      &:hover {
        box-shadow: var(--shadow);
      }
    }
  }

  .staking-info {
    @include mixins.mobile {
      display: none;
    }
  }

  .full-width {
    grid-column: 1 / -1;
  }
</style>
