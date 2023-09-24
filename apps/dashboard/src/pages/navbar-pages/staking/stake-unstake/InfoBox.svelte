<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import InfoIcon from '@icons/info.svg'

  export let link: {
    text: string
    href: string
  }
</script>

<div class="info-box">
  <div>
    <IconNew icon={InfoIcon} faded />
  </div>

  <div class="body">
    <h4 class="title">
      <slot name="title" />
    </h4>
    <p class="explanation">
      <slot name="explanation" />
    </p>
  </div>

  <div />

  <div class="link">
    <a href={link.href} target="_blank">{link.text}</a>
  </div>
</div>

<style lang="scss">
  .info-box {
    display: grid;
    grid: 1fr 2rem / 2rem auto;
    border: var(--border) var(--theme-border);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    max-width: 20rem;

    .body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--spacing-md);
    }

    .title {
      font-size: var(--text-md);
      font-weight: var(--font-weight-bold);
      color: var(--theme-subtext);
    }

    .explanation {
      font-size: var(--text-sm);
      color: var(--theme-subtext);
    }

    .link {
      display: flex;
      align-self: end;

      a {
        color: var(--color-grey-2);
        text-decoration-line: underline;
      }
    }
  }
</style>
