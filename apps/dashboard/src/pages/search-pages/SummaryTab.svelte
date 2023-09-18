<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import SummaryMetadata from './SummaryMetadata.svelte'
  import SummaryTabHeading from './SummaryTabHeading.svelte'

  export let entity: ComponentProps<SummaryTabHeading>['entity']
  export let standardMetadata: ComponentProps<SummaryMetadata>['standardMetadata']
  export let nonMetadataItems: ComponentProps<SummaryMetadata>['nonMetadataItems']
  export let associatedDapps: ComponentProps<SummaryMetadata>['associatedDapps']
  export let omittedKeys: ComponentProps<SummaryMetadata>['omittedKeys'] = []
  export let redeemableTokens: ComponentProps<SummaryMetadata>['redeemableTokens'] =
    undefined
</script>

<div class="summary-tab">
  <SummaryTabHeading {entity} />
  <SummaryMetadata
    {standardMetadata}
    {nonMetadataItems}
    {associatedDapps}
    {omittedKeys}
    {redeemableTokens}
  />
</div>

<style>
  .summary-tab {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
  }
</style>
