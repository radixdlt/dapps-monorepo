<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import SummaryTab from '../SummaryTab.svelte'
  import { formatTokenValue } from '@common/utils/formatting'
  import type { StakeUnit } from '@common/api/utils/entities/resource/fungible/stake-unit'

  export let stakeUnit: Promise<StakeUnit>
  export let associatedDapps: ComponentProps<SummaryTab>['associatedDapps']
  export let behaviors: ComponentProps<SummaryTab>['behaviors']
</script>

<div class="card">
  <SummaryTab
    entity={stakeUnit}
    standardMetadata={stakeUnit.then(({ metadata: { expected } }) => expected)}
    nonMetadataItems={stakeUnit.then((stakeUnit) => [
      [
        'associated validator',
        stakeUnit.metadata.expected.validator?.typed.value,
        'GlobalAddress'
      ],
      [
        'current supply',
        formatTokenValue(stakeUnit.totalSupply).displayValue,
        'String'
      ],
      ['divisibility', stakeUnit.divisibility, 'U32']
    ])}
    {associatedDapps}
    omittedKeys={['validator']}
    {behaviors}
  />
</div>
