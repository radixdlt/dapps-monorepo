/// <reference lib="dom" />
import { ResultAsync, errAsync, okAsync } from 'neverthrow'
import type { Account } from '@stores'
import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'
import blake from 'blakejs'
import { getContext, setContext } from 'svelte'
import { EXPECTED_EPOCH_TIME_MINUTES, XRD_SYMBOL } from '@constants'
import { pipe } from 'ramda'

const XRD_DECIMALS = 18

export const getTxIdFromMessage = (message: string): string | undefined => {
  if (message.toLowerCase().includes('txid: ')) {
    const [, txId] = message.split(' ')
    return txId
  }
}

export const shortenAddress = (
  address?: string,
  maxNftIdLength = 18
): string => {
  if (address?.includes(':')) {
    const [resourceAddress, nftID] = address.split(':')
    return `${shortenAddress(resourceAddress)}:${shortenNftID(
      nftID,
      maxNftIdLength
    )}`
  }

  return address
    ? `${address.slice(0, 4)}…${address.slice(
        address.length - 6,
        address.length
      )}`
    : ''
}

export const shortenNftID = (id: string, maxNftIdLength = 18) => {
  if (id.startsWith('{')) {
    return `${id.slice(0, 5)}…${id.slice(id.length - 5, id.length)}`
  }

  const difference = id.length - maxNftIdLength
  const halfDifference = Math.floor(difference / 2)
  const halfLength = Math.floor(id.length / 2)
  return difference <= 0
    ? id
    : `${id.slice(0, halfLength - halfDifference)}…${id.slice(
        halfLength + halfDifference,
        id.length
      )}`
}

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
  | 'pool'
  | 'validator'

export const getAddressPrefix = (address: string): AddressPrefix => {
  const parts = address.split('_')
  return parts[0] as AddressPrefix
}

export const getNFTAddress = (resourceAddress: string, nftID: string) =>
  `${shortenAddress(resourceAddress)}:${nftID}`

export const isNFTAddress = (address: string) =>
  getAddressPrefix(address) === 'resource' && address.split(':').length > 1

export const addressToRoute = async (address: string) =>
  ({
    account: `/account/${encodeURIComponent(address)}`,
    resource: `/resource/${encodeURIComponent(address)}`,
    package: `/package/${encodeURIComponent(address)}`,
    component: `/component/${encodeURIComponent(address)}`,
    txid: `/transaction/${encodeURIComponent(address)}`,
    validator: `/validator/${encodeURIComponent(address)}`,
    identity: `/identity/${encodeURIComponent(address)}`,
    pool: `/pool/${encodeURIComponent(address)}`
  }[getAddressPrefix(address)] ?? `/component/${encodeURIComponent(address)}`)

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
  const removeCommasFromString = <T>(input: T): T =>
    typeof input === 'string' ? (input.split(',').join('') as T) : input
  const stringToBigInt = (input: string) => new BigNumber(input)
  const splitIntegerAndDecimals = (input: string) => input.split('.')
  const round =
    (stringValue: string, maxPlaces = 8) =>
    (bigNumberInput: BigNumber) => {
      const [integer, decimals] = splitIntegerAndDecimals(stringValue)

      if (integer.length >= maxPlaces)
        return bigNumberInput.decimalPlaces(1, BigNumber.ROUND_UP)

      const decimalPlaces = maxPlaces - integer.length
      const rounded = bigNumberInput.decimalPlaces(
        decimalPlaces,
        BigNumber.ROUND_HALF_UP
      )

      return rounded.eq(BigNumber(0)) && decimals && decimals.length > 0
        ? '~0'
        : rounded
    }

  const addSuffix =
    (stringValue: string, maxPlaces = 8) =>
    (input: BigNumber | string) => {
      if (typeof input === 'string')
        return { rounded: '~0', suffix: '', value: '~0' }
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
        rounded: updatedValue.toFixed(),
        suffix,
        value: input.toFixed()
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
  const strInput = new BigNumber(removeCommasFromString(input)).toFixed()

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

export const formatXRDValue = (value: string | BigNumber) =>
  `${formatTokenValue(value).displayValue} ${XRD_SYMBOL}`

export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    globalThis.navigator ? globalThis.navigator.userAgent : ''
  )

export const timeToEpoch = (currentEpoch: number, toEpoch: number) => {
  const MINUTES_HOUR = 60
  const HOURS_DAY = 24
  const MINUTES_DAY = MINUTES_HOUR * HOURS_DAY

  const diff = new BigNumber(toEpoch).minus(currentEpoch)
  const daysToClaim = diff
    .multipliedBy(EXPECTED_EPOCH_TIME_MINUTES)
    .dividedBy(MINUTES_DAY)

  if (daysToClaim.isLessThan(1)) {
    const hoursToClaim = daysToClaim.multipliedBy(HOURS_DAY)

    if (hoursToClaim.isLessThan(1)) {
      const minutesToClaim = hoursToClaim.multipliedBy(MINUTES_HOUR)

      if (minutesToClaim.lt(EXPECTED_EPOCH_TIME_MINUTES)) {
        return `less than ${EXPECTED_EPOCH_TIME_MINUTES} minutes`
      }
      return `${minutesToClaim.toFixed(0)} minutes`
    }
    return `${hoursToClaim.toFixed(0)} hours`
  }
  return `${daysToClaim.toFixed(0)} days`
}
