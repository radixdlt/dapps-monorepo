<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import SummaryTab from '../SummaryTab.svelte'
  import type { StakeUnit } from '@api/utils/entities/stake-unit'

  export let stakeUnit: Promise<StakeUnit>
  export let associatedDapps: ComponentProps<SummaryTab>['associatedDapps']
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
      ['current supply', stakeUnit.totalSupply, 'U64'],
      ['divisibility', stakeUnit.divisibility, 'U32']
    ])}
    {associatedDapps}
    omittedKeys={['validator']}
  />
</div>
