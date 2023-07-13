<script lang="ts">
  import MetadataInfoBox, {
    type ExtendedEntityMetadataItem
  } from '@components/metadata-info-box/MetadataInfoBox.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  const metadata = data.promises.entityDetails.then(
    ({ metadata }) => metadata.items
  ) as unknown as Promise<ExtendedEntityMetadataItem[]>
</script>

<div class="surface-2">
  <MetadataInfoBox {metadata} />
</div>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .surface-2 {
    @include mixins.card();
  }
</style>
