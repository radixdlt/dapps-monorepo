import { withFormattedErrors } from '@queries/with-formatted-errors'
import z, { string, object, array } from 'zod'

const sendTransactionIOType = object({
  transactionHash: string()
})

const requestAddressesIOType = object({
  accountAddresses: array(
    object({
      address: string(),
      label: string()
    })
  )
})

export const SendTransactionIO = withFormattedErrors(sendTransactionIOType)

export const RequestAddressesIO = withFormattedErrors(requestAddressesIOType)

export type SendTransaction = z.infer<typeof sendTransactionIOType>
export type RequestAddresses = z.infer<typeof requestAddressesIOType>
