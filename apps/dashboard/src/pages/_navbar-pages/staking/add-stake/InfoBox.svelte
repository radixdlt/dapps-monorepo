<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'

  export let link: {
    text: string
    href: string
  }
</script>

<div class="info-box">
  <div>
    <IconNew type="info" faded />
  </div>

  <div class="body">
    <div class="title">
      <slot name="title" />
    </div>
    <div class="explanation">
      <slot name="explanation" />
    </div>
  </div>

  <div />

  <div class="link">
    <a href={link.href}>{link.text}</a>
  </div>
</div>

<style lang="scss">
  .info-box {
    display: grid;
    grid: 1fr 2fr / 2rem auto;
    border: var(--border);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-lg);

    .body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--spacing-xs);
    }

    .title {
      font-size: var(--text-md);
      font-weight: var(--font-weight-bold);
      color: var(--color-grey-2);
    }

    .explanation {
      font-size: var(--text-sm);
      color: var(--color-grey-2);
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
