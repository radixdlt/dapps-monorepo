<script lang="ts">
  import IconNew from '../icon/IconNew.svelte'
  import ExternalLink from '@icons/external-link.svg'

  export let url: string
  export let text = ''
  export let external = false
</script>

<div class="wrapper">
  <a href={url} target={external ? '_blank' : '_self'}>{text || url}</a>
  {#if external}<IconNew icon={ExternalLink} />{/if}
</div>

<style lang="scss">
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
