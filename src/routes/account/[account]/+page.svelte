<script lang="ts">
  import { getEntityDetails } from '@api/gateway'
  import { getResources } from '@components/_navbar-pages/send-tokens/side-effects'
  import Account from '@components/_search-pages/account/Account.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: details = getEntityDetails(data.accountAddress)

  $: resources = getResources(data.accountAddress)
</script>

<Account address={data.accountAddress} {resources} {details} />
