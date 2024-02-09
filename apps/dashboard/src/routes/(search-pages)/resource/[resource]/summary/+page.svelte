<script lang="ts">
  import SummaryTab from '@dashboard/pages/search-pages/SummaryTab.svelte'
  import type { LayoutData } from '../$types'
  import { formatTokenValue } from '@utils'
  import { metadataItem } from '@dashboard/pages/search-pages/utils'

  export let data: LayoutData

  const resource = data.resource

  $: nonMetadataItems = Promise.resolve(resource).then((resource) => {
    let metadata: Parameters<typeof metadataItem>[] = [
      [
        'total supply',
        formatTokenValue(resource.totalSupply).displayValue,
        'String'
      ]
    ]

    if (resource.resourceType === 'fungible') {
      metadata.push(['divisibility', resource.divisibility, 'U8'])

      if (resource.type === 'poolUnit') {
        metadata.push([
          'associated pool component',
          resource.metadata.expected.pool?.typed.value,
          'GlobalAddress'
        ])
      }
    }

    return metadata
  })
</script>

<div class="card info-card">
  <SummaryTab
    entity={Promise.resolve(resource)}
    standardMetadata={Promise.resolve(resource.metadata.expected)}
    {nonMetadataItems}
    associatedDapps={data.promises.associatedDapps}
    omittedKeys={['pool']}
    redeemableTokens={data.promises.redeemableTokens}
    behaviors={Promise.resolve(resource.behaviors)}
  />
</div>
