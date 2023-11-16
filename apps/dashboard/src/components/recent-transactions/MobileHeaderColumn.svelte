<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'
  import TxMessageColumn from './TxMessageColumn.svelte'
  import ChevronRight from '@icons/chevron-right.svg'

  export let message: string
  export let id: string
  export let date: string
</script>

<div class="header-column">
  <TxMessageColumn {message} />
  <DateAndTxIdColumn {id} {date} />
  <div class="ml-auto">
    <IconNew icon={ChevronRight} />
  </div>
</div>

<style lang="scss">
  .header-column {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .ml-auto {
    margin-left: auto;
  }
</style>
