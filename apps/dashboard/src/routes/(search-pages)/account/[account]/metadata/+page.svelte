<script lang="ts">
  import Tags from '@components/_base/tags/Tags.svelte'
  import Link from '@components/_base/link/Link.svelte'
  import AddressesList from '@components/_base/address/AddressesList.svelte'
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'
  import type { EntityMetadataItemValue } from '@radixdlt/babylon-gateway-api-sdk'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  const expectedEntries = {
    account_type: {},
    name: {},
    description: {},
    tags: {
      component: Tags,
      componentProperties: (value: EntityMetadataItemValue) => ({
        showNetworkTag: false,
        tags: value.as_string_collection
      })
    },
    icon_url: {
      label: 'Icon',
      component: IconNew,
      componentProperties: (value: EntityMetadataItemValue) => ({
        icon: value.as_string,
        size: 'large',
        rounded: true
      })
    },
    claimed_entities: {
      component: AddressesList,
      componentProperties: (value: EntityMetadataItemValue) => ({
        addresses: value.as_string_collection
      })
    },
    claimed_website: {
      component: Link,
      componentProperties: (value: EntityMetadataItemValue) => ({
        url: value.as_string,
        external: true
      })
    }
  }

  const metadata = data.promises.entityDetails.then(
    ({ metadata }) => metadata.items
  )
</script>

<div class="surface-2">
  <MetadataInfoBox {metadata} {expectedEntries} />
</div>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .surface-2 {
    @include mixins.card();
  }
</style>
