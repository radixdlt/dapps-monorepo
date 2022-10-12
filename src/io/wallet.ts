import z, { string, object } from 'zod'

export const SendTransactionIO = object({
  transactionHash: string()
})

export type SendTransaction = z.infer<typeof SendTransactionIO>
