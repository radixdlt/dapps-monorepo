<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Select from '@components/_base/select/Select.svelte'
  import { context, type FormattedAccount } from '../../DappMetadata.svelte'

  export let data: FormattedAccount[] | undefined

  const setSelectedAccount = context.get('selectedAccount')

  $: if (data && data[0]) setSelectedAccount(data[0])
</script>

<Box wrapper cx={{ width: '300px' }}>
  <Select handleSelect={setSelectedAccount} options={data} />
</Box>
