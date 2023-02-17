<script lang="ts">
  import Account from '@components/_search-pages/account/Account.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Account address={data.accountAddress} />
