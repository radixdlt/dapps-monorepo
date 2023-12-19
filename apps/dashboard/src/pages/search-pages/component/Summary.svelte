<script lang="ts">
  import type { Component } from '@api/utils/entities/component'
  import SummaryTab from '../SummaryTab.svelte'

  export let component: Promise<Component>
  export let associatedDapps: Promise<
    {
      address: string
      name: string
      iconUrl: string
    }[]
  >
</script>

<div class="card">
  <SummaryTab
    entity={component}
    standardMetadata={component.then(({ metadata: { expected } }) => expected)}
    nonMetadataItems={component.then((component) => [
      ['parent package', component.packageAddress, 'GlobalAddress'],
      ['blueprint name', component.blueprintName, 'String']
    ])}
    {associatedDapps}
  />
</div>
