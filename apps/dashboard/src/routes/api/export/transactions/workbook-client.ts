import ExcelJS from 'exceljs'
import type { CommittedTransactionInfo } from '@common/gateway-sdk'

export type WorkbookClient = ReturnType<typeof WorkbookClient>

export const WorkbookClient = ({ toDate }: { toDate: Date }) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Transactions')
  worksheet.addRow(['Transaction ID', 'Timestamp', 'Fee'])

  return {
    addRows: (items: CommittedTransactionInfo[]) => {
      items.forEach((tx) => {
        if (new Date(tx.round_timestamp) < toDate) {
          worksheet.addRow([tx.intent_hash, tx.confirmed_at, tx.fee_paid])
        }
      })
    },
    csvBuffer: () => workbook.csv.writeBuffer()
  }
}
