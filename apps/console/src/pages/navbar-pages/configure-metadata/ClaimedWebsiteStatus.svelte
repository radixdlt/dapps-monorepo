<script lang="ts">
  import LinkStatus from './LinkStatus.svelte'
  import { writable } from 'svelte/store'
  import { http } from '@common/http'

  export let entityAddress: string
  export let value: string

  const status = writable<
    'none' | 'loading' | 'verified' | 'notVerified' | 'error'
  >('none')

  const headerTexts = {
    verified: 'Confirmed',
    notVerified: 'Not Confirmed',
    error: 'Error'
  }

  const texts = {
    verified: 'Website has valid `.well-known/radix.json` confirming claim',
    notVerified:
      "`.well-known/radix.json` file is not currently confirming this dApp Definition's claim",
    error:
      'Website does not have `.well-known/radix.json` file or is not reachable'
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  $: {
    if (isValidUrl(value)) {
      http
        .post('api/claimed-website', {
          url: value,
          expectedAddress: entityAddress
        })
        .then(({ output }) => {
          status.set(output)
        })
    }
  }
</script>

<LinkStatus {status} {headerTexts} {texts} />
