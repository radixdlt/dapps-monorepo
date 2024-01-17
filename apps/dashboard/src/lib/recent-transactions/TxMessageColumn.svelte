<script lang="ts">
  import Tooltip from '@svelte-ui/components/_base/tooltip/Tooltip.svelte'
  import TxMessage from './TxMessage.svg'
  import IconNew from '@svelte-ui/components/_base/icon/IconNew.svelte'

  export let message: string
</script>

{#if message}
  <Tooltip text={' '} headerText={message}>
    <div class="message-background">
      <IconNew icon={TxMessage} size="large" --size="20px" />
    </div>
  </Tooltip>
{/if}

<style lang="scss">
  .message-background {
    margin: 0 auto;
    max-width: 32px;
    background: var(--color-grey-5);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
  }
</style>
