<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import SummaryTab from '../SummaryTab.svelte'
  import type { StakeUnit } from '@api/_deprecated/utils/entities/stake-unit'
  import { formatTokenValue } from '@utils'

  export let stakeUnit: Promise<StakeUnit>
  export let associatedDapps: ComponentProps<SummaryTab>['associatedDapps']
  export let behaviors: ComponentProps<SummaryTab>['behaviors']
</script>

<div class="card">
  <SummaryTab
    entity={stakeUnit}
    standardMetadata={stakeUnit.then(({ metadata: { standard } }) => standard)}
    nonMetadataItems={stakeUnit.then((stakeUnit) => [
      [
        'associated validator',
        stakeUnit.metadata.standard.validator?.value,
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
