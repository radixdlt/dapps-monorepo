import ExcelJS from 'exceljs'
import type { CommittedTransactionInfo } from '@common/gateway-sdk'
import dayjs from 'dayjs'
import type { ResourceCacheClient } from '@api/utils/resource-cache-client'

export type WorkbookClient = ReturnType<typeof WorkbookClient>

export const WorkbookClient = ({
  toDate,
  entityAddress,
  resourcesCacheClient
}: {
  toDate: dayjs.Dayjs
  entityAddress: string
  resourcesCacheClient: ResourceCacheClient
}) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Transactions')
  worksheet.addRow([
    'Transaction ID',
    'Timestamp',
    'Fee',
    'Message',
    'Resource',
    'Resource Name',
    'Balance Decreases',
    'Balance Increases'
  ])

  return {
    addRows: (items: CommittedTransactionInfo[]) => {
      items
        .filter((tx) => dayjs.utc(tx.round_timestamp).diff(toDate) <= 0)
        .forEach((tx) => {
          let txRecorded = false
          const message = (tx?.message as any)?.content?.value
          const txInfo = [tx.intent_hash, tx.confirmed_at, tx.fee_paid, message]

          if (!tx.balance_changes) {
            txRecorded = true
            worksheet.addRow([
              ...txInfo,
              'data not loaded',
              'data not loaded',
              'data not loaded',
              'data not loaded'
            ])
          } else {
            tx.balance_changes?.fungible_balance_changes.forEach((change) => {
              if (change.entity_address === entityAddress) {
                txRecorded = true
                worksheet.addRow([
                  ...txInfo,
                  change.resource_address,
                  resourcesCacheClient.fungibleResources.get(
                    change.resource_address
                  )?.displayName,
                  change.balance_change.startsWith('-')
                    ? change.balance_change
                    : '',
                  change.balance_change.startsWith('-')
                    ? ''
                    : change.balance_change
                ])
              }
            })

            tx.balance_changes?.non_fungible_balance_changes.forEach(
              (change) => {
                if (change.entity_address === entityAddress) {
                  txRecorded = true
                  worksheet.addRow([
                    ...txInfo,
                    change.resource_address,
                    resourcesCacheClient.nonFungibleResources.get(
                      change.resource_address
                    )?.displayName,
                    change.removed.map((removed) => `${removed}`).join('\n'),
                    change.added.map((added) => `${added}`).join('\n')
                  ])
                }
              }
            )
          }

          if (!txRecorded) {
            worksheet.addRow([...txInfo])
          }
        })
    },
    csvBuffer: () => workbook.csv.writeBuffer()
  }
}
