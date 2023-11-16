import ExcelJS from 'exceljs'
import type { CommittedTransactionInfo } from '@common/gateway-sdk'
import dayjs from 'dayjs'

export type WorkbookClient = ReturnType<typeof WorkbookClient>

export const WorkbookClient = ({
  toDate,
  entityAddress
}: {
  toDate: dayjs.Dayjs
  entityAddress: string
}) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Transactions')
  worksheet.addRow([
    'Transaction ID',
    'Timestamp',
    'Fee',
    'Message',
    'Resource',
    'Balance Decreases',
    'Balance Increases'
  ])

  return {
    addRows: (items: CommittedTransactionInfo[]) => {
      items
        .filter((tx) => dayjs.utc(tx.round_timestamp).diff(toDate) <= 0)
        .forEach((tx) => {
          const message = (tx?.message as any)?.content?.value
          const txInfo = [tx.intent_hash, tx.confirmed_at, tx.fee_paid, message]

          tx.balance_changes?.fungible_balance_changes.forEach((change) => {
            if (change.entity_address === entityAddress) {
              worksheet.addRow([
                ...txInfo,
                change.resource_address,
                change.balance_change.startsWith('-')
                  ? change.balance_change
                  : '',
                change.balance_change.startsWith('-')
                  ? ''
                  : change.balance_change
              ])
            }
          })

          tx.balance_changes?.non_fungible_balance_changes.forEach((change) => {
            if (change.entity_address === entityAddress) {
              worksheet.addRow([
                ...txInfo,
                change.resource_address,
                change.added
                  .map((added) => `${change.resource_address}:${added}`)
                  .join('\n'),
                change.removed
                  .map((removed) => `${change.resource_address}:${removed}`)
                  .join('\n')
              ])
            }
          })
        })
    },
    csvBuffer: () => workbook.csv.writeBuffer()
  }
}
