import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'
import CryptoJS from 'crypto-js'

const XRD_DECIMALS = 18

export const getTxIdFromMessage = (message: string): string => {
  const [, txId] = message.split(' ')
  return txId ? txId : message
}

export const shortenAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(
    address.length - 6,
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

export function bufferFromHex(hex: string): Buffer {
  return Buffer.from(hex, 'hex')
}

export function hash(message: string): Buffer {
  return bufferFromHex(
    CryptoJS.SHA256(CryptoJS.enc.Hex.parse(message)).toString()
  )
}

export const getFileExtension = (filename: string) => {
  const parts = filename.split('.')
  return parts[parts.length - 1]
}

type AddressPrefix =
  | 'package'
  | 'resource'
  | 'account'
  | 'transaction'
  | 'component'
export const getAddressPrefix = (address: string): AddressPrefix => {
  const parts = address.split('_')
  return (parts[0] as AddressPrefix) ?? 'transaction'
}

export const getNFTAddress = (resourceAddress: string, nftID: string) =>
  `${shortenAddress(resourceAddress)}:${nftID}`

export const isNFTAddress = (address: string) =>
  getAddressPrefix(address) === 'resource' && address.split(':').length > 1
