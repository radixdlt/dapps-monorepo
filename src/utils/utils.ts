import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'
import CryptoJS from 'crypto-js'

const XRD_DECIMALS = 18

export const shortenAddress = (address: string) =>
  `${address.slice(0, 5)}...${address.slice(
    address.length - 4,
    address.length
  )}`

export const toWholeUnits = (tokenValue: string) =>
  BigNumber(tokenValue)
    .div(10 ** XRD_DECIMALS)
    .decimalPlaces(2)
    .toNumber()

export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.slice(1).toLowerCase()

export const isSameRoute = (route: string, routeName: string) => {
  const routeArray = route.split('/')
  return routeArray[1] === routeName
}

export function hexStringFromByteArray(byteArray: Uint8Array): string {
  return Buffer.from(byteArray).toString('hex')
}

export function byteArrayFromHex(hex: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hex, 'hex'))
}

export function hash(message: Uint8Array): Uint8Array {
  return byteArrayFromHex(
    CryptoJS.SHA256(
      CryptoJS.enc.Hex.parse(hexStringFromByteArray(message))
    ).toString()
  )
}

export const getFileExtension = (filename: string) => {
  const parts = filename.split('.')
  return parts[parts.length - 1]
}
