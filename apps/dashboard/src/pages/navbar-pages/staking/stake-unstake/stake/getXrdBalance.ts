import { getAccountData } from '@api/utils/resources'
import { CURRENT_NETWORK } from '@networks'

export const getXRDBalance = (address: string) =>
  getAccountData([address]).then(
    (data) =>
      data[0].fungible
        .find((f) => f.address === CURRENT_NETWORK.xrdAddress)
        ?.value.toString() ?? '0'
  )
