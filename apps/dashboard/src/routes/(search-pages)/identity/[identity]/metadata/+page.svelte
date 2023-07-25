<script lang="ts">
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  const metadata = data.promises.entityDetails.then(
    ({ metadata }) => metadata.items
  )
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
