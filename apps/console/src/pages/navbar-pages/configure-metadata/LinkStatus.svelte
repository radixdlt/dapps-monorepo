<script lang="ts">
  import Checkmark from '@icons/green-check.svg'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Warning from '@icons/warning.svg'
  import Cross from '@icons/cross-red.svg'
  import Tooltip from '@components/_base/tooltip/Tooltip.svelte'
  import { writable } from 'svelte/store'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'

  export let status = writable<
    'none' | 'loading' | 'verified' | 'notVerified' | 'error'
  >('none')

  export let texts = {
    verified: 'Link has been confirmed',
    notVerified: 'Link not confirmed',
    error: "Couldn't verify link"
  }

  export let headerTexts = {
    verified: 'Link has been confirmed',
    notVerified: 'Link not confirmed',
    error: "Couldn't verify link"
  }
</script>

{#if $status === 'loading'}
  <div style:height="1rem" style:aspect-ratio="1/1">
    <LoadingSpinner />
  </div>
{/if}

{#if $status === 'verified'}
  <Tooltip text={texts.verified} headerText={headerTexts.verified}>
    <IconNew icon={Checkmark} />
  </Tooltip>
{/if}

{#if $status === 'notVerified'}
  <Tooltip text={texts.notVerified} headerText={headerTexts.notVerified}>
    <IconNew icon={Warning} />
  </Tooltip>
{/if}

{#if $status === 'error'}
  <Tooltip text={texts.error} headerText={headerTexts.error}>
    <IconNew icon={Cross} />
  </Tooltip>
{/if}
