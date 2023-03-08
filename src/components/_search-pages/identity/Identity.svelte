<script lang="ts">
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'

  export let address: string
</script>

<ResourceViewTitle title="Identity" resourceAddress={address} />
