<script lang="ts" context="module">
  import type { CommittedTransactionInfo } from '@common/gateway-sdk'
  import TxMessageColumn from './TxMessageColumn.svelte'
  import MobileHeaderColumn from './MobileHeaderColumn.svelte'
  import FeeColumn from './FeeColumn.svelte'
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'
  import OtherBalanceChangesColumn from './OtherBalanceChangesColumn.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import ChevronRight from '@icons/chevron-right.svg'
  import { goto } from '$app/navigation'

  export const messageColumnDefinition = {
    id: 'message',
    width: '60px',
    hideMobile: true,
    component: TxMessageColumn,
    componentProps: {
      message: (tx: CommittedTransactionInfo) => {
        const message: string = (tx?.message as any)?.content?.value
        return message
      }
    }
  }

  export const mobileHeaderColumnDefinition = {
    id: 'mobile-header',
    hideDesktop: true,
    component: MobileHeaderColumn,
    componentProps: {
      message: (tx: CommittedTransactionInfo) => {
        const message: string = (tx?.message as any)?.content?.value
        return message
      },
      id: '$$intent_hash',
      date: '$$confirmed_at'
    }
  }

  export const dateAndTxIdColumnDefinition = {
    id: 'date-and-tx-id',
    hideMobile: true,
    width: '140px',
    header: {
      label: 'ID/DATE (GMT +00)'
    },
    component: DateAndTxIdColumn,
    componentProps: {
      id: '$$intent_hash',
      date: '$$confirmed_at'
    }
  }

  export const chevronColumnDefinition = {
    id: 'chevron',
    hideMobile: true,
    component: IconNew,
    width: '50px',
    componentProps: {
      icon: ChevronRight,
      centered: true
    }
  }

  export const getOtherBalanceChangesColumnDefinition = ({
    entityAddress
  }: { entityAddress?: string } = {}) => {
    return {
      id: 'other-balance-changes',
      width: '170px',
      header: {
        label: 'Other Balance Changes'
      },
      component: OtherBalanceChangesColumn,
      componentProps: {
        ...(entityAddress ? { entityAddress } : undefined),
        balanceChanges: '$$balance_changes'
      }
    }
  }

  export const getFeeColumnDefinition = ({
    alignment
  }: { alignment?: 'right' } = {}) => {
    return {
      id: 'fee',
      width: '160px',
      ...(alignment ? { alignment } : undefined),
      header: {
        label: 'Transaction Fee'
      },
      component: FeeColumn,
      componentProps: {
        fee: '$$fee_paid'
      }
    }
  }

  export const recentTransactionsTableConfig = {
    onRowClick: (row: any) => {
      goto(`/transaction/${row.intent_hash}/summary`)
    }
  }
</script>
