import z, { string, object, array, number } from 'zod'

export const AccountIO = object({
  address: string(),
  label: string(),
  appearanceId: number()
})

export const SendTransactionIO = object({
  transactionIntentHash: string()
})

export const RequestAddressesIO = object({
  oneTimeAccounts: array(AccountIO)
})

export type SendTransaction = z.infer<typeof SendTransactionIO>
export type RequestAddresses = z.infer<typeof RequestAddressesIO>
export type Account = z.infer<typeof AccountIO>
