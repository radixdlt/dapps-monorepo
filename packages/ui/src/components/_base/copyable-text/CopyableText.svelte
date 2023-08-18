<script lang="ts">
  import 'cooltipz-css'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import CopyIcon from '@icons/copy.svg'
  import { copyToClipboard } from '@directives/copy-to-clipboard'

  export let text: string
</script>

<div class="copyable-text">
  <div class="text">
    <slot>
      {text}
    </slot>
  </div>
  <button use:copyToClipboard={text}>
    <IconNew size="medium" icon={CopyIcon} />
  </button>
</div>

<style>
  .copyable-text {
    display: inline-flex;
    align-items: center;
  }

  .text {
    margin-right: var(--spacing-sm);
  }
</style>
