<script lang="ts">
  import { getEntityDetails } from '@api/gateway'
  import NonFungible from '@components/_search-pages/resource/non-fungible/NonFungible.svelte'
  import Resource from '@components/_search-pages/resource/Resource.svelte'
  import SearchPage from '@components/_search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: details = getEntityDetails(data.address)

  $: type = details.then(
    ({ details }) =>
      ((
        {
          fungible_resource: 'fungible',
          non_fungible_resource: 'non-fungible'
        } as const
      )[details!.discriminator as string]!)
  )
</script>

{#await type then type}
  {#if type === 'fungible'}
    <SearchPage title="Fungible Resource" address={data.address}>
      <Resource {details} />
    </SearchPage>
  {/if}

  {#if type === 'non-fungible'}
    <SearchPage title="Non-Fungible Resource" address={data.address}>
      <Resource {details}>
        <NonFungible address={data.address} />
      </Resource>
    </SearchPage>
  {/if}
{/await}
