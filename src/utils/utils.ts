import BigNumber from "bignumber.js"

const XRD_DECIMALS = 18

export const shortenAddress = (address: string) =>
  `${address.slice(0, 5)}
  ...
  ${address.slice(address.length - 4, address.length)}`

export const toWholeUnits = (tokenValue: string) =>
  BigNumber(tokenValue).div(10 ** XRD_DECIMALS).decimalPlaces(2).toNumber()
