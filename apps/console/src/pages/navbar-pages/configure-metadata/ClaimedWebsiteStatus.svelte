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
    verified: 'URL has valid `.well-known/radix.json` deployed',
    notVerified:
      "URL can't be verified. Make sure `.well-known/radix.json` is deployed correctly",
    error: "Can't check URL"
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
