import z, { string, object, array } from 'zod'

export const SendTransactionIO = object({
  transactionIntentHash: string()
})

export const RequestAddressesIO = object({
  oneTimeAccountAddresses: array(
    object({
      address: string(),
      label: string()
    })
  )
})

export type SendTransaction = z.infer<typeof SendTransactionIO>
export type RequestAddresses = z.infer<typeof RequestAddressesIO>
