import ExcelJS from 'exceljs'
import type { CommittedTransactionInfo } from '@common/gateway-sdk'
import dayjs from 'dayjs'

export type WorkbookClient = ReturnType<typeof WorkbookClient>

export const WorkbookClient = ({ toDate }: { toDate: dayjs.Dayjs }) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Transactions')
  worksheet.addRow(['Transaction ID', 'Timestamp', 'Fee'])

  return {
    addRows: (items: CommittedTransactionInfo[]) => {
      items.forEach((tx) => {
        if (dayjs.utc(tx.round_timestamp).diff(toDate) <= 0) {
          worksheet.addRow([tx.intent_hash, tx.confirmed_at, tx.fee_paid])
        }
      })
    },
    csvBuffer: () => workbook.csv.writeBuffer()
  }
}
