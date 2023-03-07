<script lang="ts">
  import { getEntityDetails } from '@api/gateway'
  import { getPopulatedResources } from '@api/utils/resources'
  import Account from '@components/_search-pages/account/Account.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: details = getEntityDetails(data.accountAddress)

  $: resources = getPopulatedResources(data.accountAddress)
</script>

<Account address={data.accountAddress} {resources} {details} />
