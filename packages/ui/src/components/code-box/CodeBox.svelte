<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { copyToClipboard } from '@directives/copy-to-clipboard'
  import CopyIcon from '@icons/copy.svg'
  export let text: string
</script>

<div class="wrapper">
  <button class="icon" use:copyToClipboard={text}>
    <IconNew icon={CopyIcon} size="medium" />
  </button>

  <textarea class="code-box" disabled value={text} />
</div>

<style lang="scss">
  .wrapper {
    position: relative;
    width: 100%;
  }

  .icon {
    position: absolute;
    right: 25px;
    top: 10px;
  }

  .code-box {
    width: 100%;
    height: 100%;
    min-height: var(--code-box-min-height, '300px');
    padding: var(--space-sm);
    background-color: var(--color-grey-4);
    resize: none;
    color: var(--color-grey-1);
    border-color: var(--color-grey-3);
    border-radius: var(--border-radius-lg);

    @include mixins.desktop {
      padding: var(--space-lg);
    }
  }
</style>
