import z, { string, object, array } from 'zod'

export const AccountIO = object({
  address: string(),
  label: string()
})

export const SendTransactionIO = object({
  transactionIntentHash: string()
})

export const RequestAddressesIO = object({
  oneTimeAccountAddresses: array(AccountIO)
})

export type SendTransaction = z.infer<typeof SendTransactionIO>
export type RequestAddresses = z.infer<typeof RequestAddressesIO>
export type Account = z.infer<typeof AccountIO>
