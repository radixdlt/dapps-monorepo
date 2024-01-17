import BigNumber from 'bignumber.js'
import type { Account } from '../../../svelte-ui/src/lib/stores'
import { pipe } from 'ramda'
import { XRD_SYMBOL } from './constants'
import { Buffer } from 'buffer'
import blake from 'blakejs'

type AddressPrefix =
  | 'package'
  | 'resource'
  | 'account'
  | 'txid'
  | 'component'
  | 'identity'
  | 'pool'
  | 'validator'

export const shortenAddress = (address?: string) =>
  address
    ? `${address.slice(0, 4)}...${address.slice(
        address.length - 6,
        address.length
      )}`
    : ''

export const shortenNftID = (id: string) =>
  id.length > 10
    ? `${id.slice(0, 4)}...${id.slice(id.length - 6, id.length)}`
    : id

export const capitalize = (text: string) =>
  text[0]?.toUpperCase() + text.slice(1).toLowerCase()

export const truncateNumber = (num: number) =>
  new BigNumber(num).toFixed(2, BigNumber.ROUND_DOWN)

export const accountLabel = (account: Omit<Account, 'displayed'>) =>
  `${account.label} (${shortenAddress(account.address)})`

export const getNFTAddress = (resourceAddress: string, nftID: string) =>
  `${shortenAddress(resourceAddress)}:${nftID}`

export const isNFTAddress = (address: string) =>
  getAddressPrefix(address) === 'resource' && address.split(':').length > 1

export const getAddressPrefix = (address: string): AddressPrefix => {
  const parts = address.split('_')
  return parts[0] as AddressPrefix
}

export const formatTokenValue = (
  input: string | number | BigNumber,
  options?: Partial<{ maxPlaces: number; thousandsSeparator: string }>
) => {
  const removeCommasFromString = (input: string | number | BigNumber) =>
    typeof input === 'string' ? input.split(',').join('') : input
  const stringToBigInt = (input: string) => new BigNumber(input)
  const splitIntegerAndDecimals = (input: string) => input.split('.')
  const round =
    (stringValue: string, maxPlaces = 8) =>
    (input: BigNumber) => {
      const [integer] = splitIntegerAndDecimals(stringValue)
      if (integer.length >= maxPlaces)
        return input.decimalPlaces(1, BigNumber.ROUND_UP)
      const decimalPlaces = maxPlaces - integer.length
      return input.decimalPlaces(decimalPlaces, BigNumber.ROUND_HALF_UP)
    }

  const addSuffix =
    (stringValue: string, maxPlaces = 8) =>
    (input: BigNumber) => {
      const [integer] = splitIntegerAndDecimals(stringValue)

      let suffix = ''
      let updatedValue = input

      if (integer.length >= 15) {
        suffix = 'T'
        updatedValue = input
          .shiftedBy(-12)
          .decimalPlaces(
            maxPlaces - (integer.length - 12),
            BigNumber.ROUND_HALF_UP
          )
      } else if (integer.length >= 12) {
        suffix = 'B'
        updatedValue = input
          .shiftedBy(-9)
          .decimalPlaces(
            maxPlaces - (integer.length - 9),
            BigNumber.ROUND_HALF_UP
          )
      } else if (integer.length >= 9) {
        suffix = 'M'
        updatedValue = input
          .shiftedBy(-6)
          .decimalPlaces(
            maxPlaces - (integer.length - 6),
            BigNumber.ROUND_HALF_UP
          )
      }

      return {
        rounded: updatedValue.toString(),
        suffix,
        value: input.toString()
      }
    }

  const thousandsSeparator =
    (character = ',') =>
    (input: string) => {
      const [integer, decimals] = input.split('.')
      return [integer.replace(/\B(?=(\d{3})+(?!\d))/g, character), decimals]
        .filter((value) => value !== undefined)
        .join('.')
    }

  const strInput = new BigNumber(removeCommasFromString(input)).toString()

  return pipe(
    stringToBigInt,
    round(strInput, options?.maxPlaces),
    addSuffix(strInput, options?.maxPlaces),
    ({ value, suffix, rounded }) => ({
      rounded: thousandsSeparator(options?.thousandsSeparator)(rounded),
      value: thousandsSeparator(options?.thousandsSeparator)(value),
      suffix,
      displayValue: `${thousandsSeparator(options?.thousandsSeparator)(
        rounded
      )}${suffix}`
    })
  )(strInput)
}

export const formatXRDValue = (value: string) =>
  `${formatTokenValue(value).displayValue} ${XRD_SYMBOL}`

export const isSameRoute = (route: string, routeName: string) => {
  const routeArray = route.split('/')
  return routeArray[1] === routeName.split('/').pop()
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

export const separateThousands =
  (character = ',') =>
  (input: string) => {
    const [integer, decimals] = input.split('.')
    return [integer.replace(/\B(?=(\d{3})+(?!\d))/g, character), decimals]
      .filter((value) => value !== undefined)
      .join('.')
  }

export const removeThousandsSeparator = (input: string) =>
  input.replace(/,/g, '')
