import BigNumber from 'bignumber.js'
import { pipe } from 'ramda'

const stringToBigInt = (input: string) => new BigNumber(input)

const bigIntToString = (input: BigNumber) => input.toString()

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

export const formatTokenValue = (
  input: string,
  options?: Partial<{ maxPlaces: number; thousandsSeparator: string }>
) =>
  pipe(
    stringToBigInt,
    round(input, options?.maxPlaces),
    bigIntToString,
    separateThousands(options?.thousandsSeparator)
  )(input)
