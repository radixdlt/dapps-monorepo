import z, { string, object, array } from 'zod'

export const SendTransactionIO = object({
  transactionIntentHash: string()
})

export const RequestAddressesIO = object({
  ongoingAccountAddresses: array(
    object({
      address: string(),
      label: string()
    })
  )
})

export type SendTransaction = z.infer<typeof SendTransactionIO>
export type RequestAddresses = z.infer<typeof RequestAddressesIO>
