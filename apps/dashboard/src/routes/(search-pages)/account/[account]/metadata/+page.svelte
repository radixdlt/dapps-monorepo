<script lang="ts">
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'
  import type { LayoutData } from '../$types'
  import { context } from '../+layout.svelte'

  export let data: LayoutData

  const metadata = data.promises.accountData.then(
    ({ details: { metadata } }) => metadata.items
  )

  const activeTab = context.get('activeTab')
  $activeTab = 'metadata'
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
