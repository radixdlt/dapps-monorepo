/// <reference lib="dom" />
import { ResultAsync, errAsync, okAsync } from 'neverthrow'
import type { Account } from '@stores'
import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'
import blake from 'blakejs'
import { getContext, setContext } from 'svelte'
import { andThen, otherwise, pipe } from 'ramda'
import { XRD_SYMBOL } from '@constants'
import { getSingleEntityDetails } from '@api/gateway'
import { getStringMetadata } from '@api/utils/metadata'
import { isStakeUnit } from '@api/utils/entities/stake-unit'

const XRD_DECIMALS = 18

export const getTxIdFromMessage = (message: string): string | undefined => {
  if (message.toLowerCase().includes('txid: ')) {
    const [, txId] = message.split(' ')
    return txId
  }
}

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

export const toWholeUnits = (tokenValue: string) =>
  BigNumber(tokenValue)
    .div(10 ** XRD_DECIMALS)
    .decimalPlaces(2)
    .toNumber()

export const capitalize = (text: string) =>
  text[0]?.toUpperCase() + text.slice(1).toLowerCase()

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

type AddressPrefix =
  | 'package'
  | 'resource'
  | 'account'
  | 'txid'
  | 'component'
  | 'identity'

export const getAddressPrefix = (address: string): AddressPrefix => {
  const parts = address.split('_')
  return parts[0] as AddressPrefix
}

const getResourceUrl = async (address: string) =>
  isNFTAddress(address)
    ? `/nft/${encodeURIComponent(address)}`
    : (await isStakeUnit(address))
    ? `/stake_unit/${address}`
    : `/resource/${address}`

export const getNFTAddress = (resourceAddress: string, nftID: string) =>
  `${shortenAddress(resourceAddress)}:${nftID}`

export const isNFTAddress = (address: string) =>
  getAddressPrefix(address) === 'resource' && address.split(':').length > 1

export const addressToRoute = async (address: string) =>
  ({
    account: `/account/${address}`,
    resource: await getResourceUrl(address),
    package: `/package/${address}`,
    component: `/component/${address}`,
    txid: `/transaction/${address}`,
    validator: `/validator/${address}`,
    identity: `/identity/${address}`
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

export const truncateNumber = (num: number) =>
  new BigNumber(num).toFixed(2, BigNumber.ROUND_DOWN)

export type Deferred<T> = Promise<T> & {
  resolve: (value: T) => void
  reject: (err: any) => void
}

export const defer = <T>(): Deferred<T> => {
  var res, rej

  var promise = new Promise<T>((resolve, reject) => {
    res = resolve
    rej = reject
  })

  // @ts-ignore
  promise.resolve = res
  // @ts-ignore
  promise.reject = rej

  return promise as Deferred<T>
}

export const deferFromPromise = <T>(promise: Promise<T>): Deferred<T> => {
  const deferred = defer<T>()
  promise.then(deferred.resolve).catch(deferred.reject)
  return deferred
}

export const typedError = <E = Error>(error: unknown) => error as E

const resolveFetch = (fetchable: ReturnType<typeof fetch>) =>
  ResultAsync.fromPromise(fetchable, typedError).mapErr((error) => ({
    reason: 'FailedToFetch',
    error,
    status: 0
  }))

export const fetchWrapper = <R = any, ER = unknown>(
  fetchable: ReturnType<typeof fetch>
): ResultAsync<
  { status: number; data: R },
  { status: number; error?: Error; reason: string; data?: unknown }
> =>
  resolveFetch(fetchable).andThen((response) =>
    ResultAsync.fromPromise<unknown, Error>(response.json(), typedError)
      .mapErr((error) => ({
        status: response.status,
        reason: 'FailedToParseResponseToJson',
        error
      }))
      .andThen((data) =>
        response.ok
          ? okAsync({
              status: response.status,
              data: data as R
            })
          : errAsync({
              status: response.status,
              reason: 'RequestStatusNotOk',
              data: data as ER
            })
      )
  )

export const formatTokenValue = (
  input: string | number | BigNumber,
  options?: Partial<{ maxPlaces: number; thousandsSeparator: string }>
) => {
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

  const strInput = new BigNumber(input).toString()

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

export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    globalThis.navigator ? globalThis.navigator.userAgent : ''
  )
