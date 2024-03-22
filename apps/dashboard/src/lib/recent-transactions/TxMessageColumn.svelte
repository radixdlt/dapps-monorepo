<script lang="ts">
  import Tooltip from '@components/_base/tooltip/Tooltip.svelte'
  import TxMessage from './TxMessage.svg'
  import IconNew from '@components/_base/icon/IconNew.svelte'

  export let message: string
</script>

<div class="message-wrapper">
  {#if message}
    <Tooltip text={' '} headerText={message}>
      <div class="message-background">
        <IconNew icon={TxMessage} />
      </div>
    </Tooltip>
  {:else}
    <div class="message-background empty">
      <IconNew icon={TxMessage} />
    </div>
  {/if}
</div>

<style lang="scss">
  .message-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .message-background {
    margin: 0 auto;
    width: 36px;
    height: 36px;
    background: var(--color-grey-5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-md);

    &.empty {
      :global(img) {
        opacity: 0.15;
      }
    }
  }
</style>
