<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import SummaryMetadata from './SummaryMetadata.svelte'
  import SummaryTabHeading from './SummaryTabHeading.svelte'
  import { xrdAddress } from '@stores'

  export let entity: ComponentProps<SummaryTabHeading>['entity'] & any
  export let standardMetadata: ComponentProps<SummaryMetadata>['standardMetadata'] &
    any
  export let nonMetadataItems: ComponentProps<SummaryMetadata>['nonMetadataItems']
  export let associatedDapps: ComponentProps<SummaryMetadata>['associatedDapps']
  export let omittedKeys: ComponentProps<SummaryMetadata>['omittedKeys'] = []
  export let redeemableTokens: ComponentProps<SummaryMetadata>['redeemableTokens'] =
    undefined
  export let behaviors: ComponentProps<SummaryMetadata>['behaviors'] = undefined

  $: isXRD = entity.then((_entity: any) => _entity.address === $xrdAddress)
</script>

<div class="summary-tab">
  <SummaryTabHeading {entity} />
  <SummaryMetadata
    {standardMetadata}
    {nonMetadataItems}
    {associatedDapps}
    {omittedKeys}
    {redeemableTokens}
    {behaviors}
    {isXRD}
  />
</div>

<style>
  .summary-tab {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
  }
</style>
