import { getAccountData } from '@api/_deprecated/utils/entities/resource'
import { xrdAddress } from '@stores'

let xrd: string | undefined

xrdAddress.subscribe((xrdAddress) => {
  xrd = xrdAddress
})

export const getXRDBalance = (address: string) =>
  getAccountData([address]).then(
    (data) =>
      data[0].fungible.find((f) => f.address === xrd)?.value.toString() ?? '0'
  )
