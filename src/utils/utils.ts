import type { Account } from '@stores'
import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'
import blake from 'blakejs'
import { getContext, setContext } from 'svelte'

const XRD_DECIMALS = 18

export const getTxIdFromMessage = (message: string): string | undefined => {
  if (message.toLowerCase().includes('txid: ')) {
    const [, txId] = message.split(' ')
    return txId
  }
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
  text[0]?.toUpperCase() + text.slice(1).toLowerCase()

export const isSameRoute = (route: string, routeName: string) => {
  const routeArray = route.split('/')
  return routeArray[1] === routeName
}

export function bufferFromHex(hex: string): Buffer {
  return Buffer.from(hex, 'hex')
}

export function hash(message: string): Buffer {
  return bufferFromHex(
    blake.blake2bHex(bufferFromHex(message), undefined, 32).toString()
  )
}

export const getFileExtension = (filename: string) => {
  const parts = filename.split('.')
  return parts[parts.length - 1] as string
}

type AddressPrefix =
  | 'package'
  | 'resource'
  | 'account'
  | 'transaction'
  | 'component'

export const getAddressPrefix = (address: string): AddressPrefix => {
  const parts = address.split('_')
  return parts.length > 1 ? (parts[0] as AddressPrefix) : 'transaction'
}

export const getNFTAddress = (resourceAddress: string, nftID: string) =>
  `${shortenAddress(resourceAddress)}:${nftID}`

export const isNFTAddress = (address: string) =>
  getAddressPrefix(address) === 'resource' && address.split(':').length > 1

export const addressToRoute = (address: string) =>
  ({
    account: `/account/${address}`,
    resource: isNFTAddress(address)
      ? `/nft/${address}`
      : `/resource/${address}`,
    package: `/package/${address}`,
    component: `/component/${address}`,
    transaction: `/transaction/${address}`
  }[getAddressPrefix(address)])

export const useContext = <
  Contexts extends Record<string, Values>,
  Values = Contexts[keyof Contexts]
>() => ({
  set: <Name extends keyof Contexts>(name: Name, value: Contexts[Name]) =>
    setContext<Contexts[typeof name]>(name, value),
  get: <Name extends keyof Contexts>(name: Name) =>
    getContext<Contexts[typeof name]>(name)
})

export const accountLabel = (account: Omit<Account, 'displayed'>) =>
  `${account.label} (${shortenAddress(account.address)})`

export const formatAmount = (amount: number) => {
  const suffixes = ['', 'K', 'M']
  let suffixNum = 0
  let shortValue = amount
  while (shortValue >= 1000 && suffixNum < 2) {
    shortValue /= 1000
    suffixNum++
  }
  return shortValue.toFixed(2) + suffixes[suffixNum]
}

export const truncateNumber = (num: number) => num.toFixed(2)
