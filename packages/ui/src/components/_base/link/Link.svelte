<script lang="ts">
  import { goto } from '$app/navigation'
  import { externalNavigationConfirmation } from '@stores'
  import IconNew from '../icon/IconNew.svelte'
  import ExternalLink from '@icons/external-link.svg'

  export let url: string
  export let text = ''
  export let external = false
</script>

{#if external}
  <a
    class="wrapper"
    href={url}
    on:click={(e) => {
      e.preventDefault()

      const awaitConfirmation = new Promise((resolve) => {
        $externalNavigationConfirmation = {
          confirm: resolve,
          url: url
        }
      })

      awaitConfirmation.then((confirmation) => {
        if (confirmation) window.open(url, '_blank')
      })
    }}
    target="_blank"
  >
    {text || url}

    <IconNew icon={ExternalLink} />
  </a>
{:else}
  <button class="link" on:click={() => goto(url)}>
    {text || url}
  </button>
{/if}

<style lang="scss">
  .link {
    color: var(--theme-button-primary);
  }

  .wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
  }

  a {
    color: var(--theme-button-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
