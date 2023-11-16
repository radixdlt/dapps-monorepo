import { getTransactionsFromDate } from '@api/gateway'
import { WorkbookClient } from './workbook-client'
import type { Buffer } from 'exceljs'
import type dayjs from '@common/dayjs'
type ParsedData = {
  fromDate: Date
  toDate: Date
  entityAddress: string
}

export const exportTransactions = (
  fromDateObject: dayjs.Dayjs,
  toDateObject: dayjs.Dayjs,
  entityAddress: string
) => {
  const workbookClient = WorkbookClient({ toDate: toDateObject, entityAddress })
  return iterateTransactionsApi(
    {
      fromDate: fromDateObject.toDate(),
      toDate: toDateObject.toDate(),
      entityAddress
    },
    workbookClient
  )
    .then(() => workbookClient.csvBuffer())
    .then((buffer) => downloadBuffer(buffer, 'transactions.csv'))
}

export const downloadBuffer = async (buffer: Buffer, filename: string) => {
  const url = URL.createObjectURL(new Blob([buffer]))
  const element = document.createElement('a')

  element.href = url
  element.setAttribute('download', filename)

  element.click()

  URL.revokeObjectURL(url)
}

export const iterateTransactionsApi = async (
  { fromDate, toDate, entityAddress }: ParsedData,
  workbookClient: WorkbookClient
) => {
  const getTransactions = (cursor?: string) =>
    getTransactionsFromDate(entityAddress, fromDate, cursor).catch(() => {
      return Promise.resolve({ items: [], next_cursor: undefined })
    })

  let { items, next_cursor } = await getTransactions()

  do {
    if (!items.length) {
      break
    }

    workbookClient.addRows(items)

    const lastElementDate = new Date(items[items.length - 1].round_timestamp)
    if (next_cursor && lastElementDate < toDate) {
      const output = await getTransactions(next_cursor)
      items = output.items
      next_cursor = output.next_cursor
    } else {
      items = []
    }
  } while (items.length)
}
