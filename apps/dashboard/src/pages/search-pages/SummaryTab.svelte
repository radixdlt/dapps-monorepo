<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import SummaryMetadata from './SummaryMetadata.svelte'
  import SummaryTabHeading from './SummaryTabHeading.svelte'

  export let entity: ComponentProps<SummaryTabHeading>['entity']
  export let standardMetadata: ComponentProps<SummaryMetadata>['standardMetadata']
  export let nonMetadataItems: ComponentProps<SummaryMetadata>['nonMetadataItems']
  export let associatedDapps: ComponentProps<SummaryMetadata>['associatedDapps']
</script>

<div class="summary-tab">
  <SummaryTabHeading {entity} />
  <SummaryMetadata {standardMetadata} {nonMetadataItems} {associatedDapps} />
</div>

<style>
  .summary-tab {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
  }
</style>
