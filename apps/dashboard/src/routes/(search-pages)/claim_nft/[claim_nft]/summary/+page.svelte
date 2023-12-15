<script lang="ts">
  import SummaryTab from '@dashboard/pages/search-pages/SummaryTab.svelte'
  import type { LayoutData } from '../$types'
  import { formatTokenValue } from '@utils'
  import { getStringMetadata } from '@api/utils/metadata'

  export let data: LayoutData
</script>

<div class="card">
  <SummaryTab
    entity={data.promises.claimNft}
    standardMetadata={data.promises.claimNft.then(
      ({ metadata: { expected } }) => expected
    )}
    nonMetadataItems={data.promises.claimNft.then((claimNft) => [
      [
        'associated validator',
        getStringMetadata('validator')({ items: claimNft.metadata.all }),
        'GlobalAddress'
      ],
      [
        'current supply',
        formatTokenValue(claimNft.totalSupply).displayValue,
        'String'
      ]
    ])}
    associatedDapps={data.promises.associatedDapps}
    behaviors={data.promises.claimNft.then(({ behaviors }) => behaviors)}
  />
</div>
