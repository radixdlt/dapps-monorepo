import { getTransactionsFromDate } from '@api/gateway'
import { RadixEngineToolkit } from '@common/ret'

import type { RequestEvent } from '@sveltejs/kit'
import { WorkbookClient } from './workbook-client'

const error = (code: number, message: string) =>
  new Response(JSON.stringify({ message }), {
    status: 400
  })

type ParsedData = {
  fromDate: Date
  toDate: Date
  entityAddress: string
}

const parseData = async ({ url }: RequestEvent): Promise<ParsedData> => {
  const toDateString = url.searchParams.get('toDate')
  const fromDateString = url.searchParams.get('fromDate')
  const entityAddress = url.searchParams.get('entityAddress')

  if (!fromDateString || !toDateString || !entityAddress) {
    throw new Error('Missing data')
  }

  const fromDate = new Date(fromDateString)
  const toDate = new Date(toDateString)

  if (
    fromDate.toString() === 'Invalid Date' ||
    toDate.toString() === 'Invalid Date'
  ) {
    throw new Error('Invalid date')
  }

  try {
    await RadixEngineToolkit.Address.decode(entityAddress)
  } catch {
    throw new Error('Invalid address')
  }

  if (fromDate > toDate) {
    throw new Error('From date must be before to date')
  }

  return { fromDate, toDate, entityAddress }
}

const iterateTransactionsApi = async (
  { fromDate, toDate, entityAddress }: Awaited<ReturnType<typeof parseData>>,
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

export const GET = async (request: RequestEvent) => {
  let parsedData: ParsedData

  try {
    parsedData = await parseData(request)
  } catch (e: any) {
    return error(400, e.message || 'Unknown error')
  }

  const workbookClient = WorkbookClient({ toDate: parsedData.toDate })

  try {
    await iterateTransactionsApi(parsedData, workbookClient)
  } catch (e: any) {
    return error(500, e.message || 'Unknown internal error')
  }

  return new Response(await workbookClient.csvBuffer(), {
    status: 200,
    headers: {
      'Content-Disposition': 'attachment; filename="transactions.csv"',
      'Content-Type': 'application/vnd.ms-excel'
    }
  })
}
