import BigNumber from 'bignumber.js'
import { separateThousands } from '../utils/format-amount'

export const format = (
  node: HTMLInputElement,
  formatFunction: (value: string) => string
) => {
  const events = ['paste', 'change']

  function updateValue() {
    node.value = formatFunction(node.value)
  }

  events.forEach(event => node.addEventListener(event, updateValue))

  node.value = formatFunction(node.value)

  return {
    destroy() {
      events.forEach(event => node.removeEventListener(event, updateValue))
    }
  }
}

const removeNonNumericCharacters = (value: string) =>
  value.replace(/[^0-9.]/g, '')

const removeLeadingZeros = (value: string) => {
  const newValue = value.replace(/^0+/, '')
  if (newValue === '') return '0'
  return newValue
}

export const number = (
  min?: string,
  max?: string,
  maxChars?: number,
  decimalPlaces = 2,
  keepDecimalPoint = false
) => (value: string) => {
  if (value === '') value = '0'

  const numericValue = removeNonNumericCharacters(value)

  // Split the value into integer and decimal parts
  const parts = numericValue.split('.')

  let integerPart = parts[0]
  let decimalPart: string | undefined = parts[1]

  integerPart = removeLeadingZeros(integerPart)

  if (maxChars) integerPart = integerPart.slice(0, maxChars)

  // Limit the number of decimal places
  if (decimalPart || decimalPart === '') {
    decimalPart = decimalPart.slice(0, decimalPlaces)
    decimalPart = decimalPart.replace(/0+$/, ''); // Remove trailing zeroes

    if (!keepDecimalPoint && decimalPart === '') decimalPart = undefined
  }

  // Apply minimum and maximum value constraints
  if (min) integerPart = BigNumber.max(integerPart, min).toString()
  if (max) integerPart = BigNumber.min(integerPart, max).toString()

  // Combine the integer and decimal parts
  let formattedValue = integerPart
  if (decimalPart || decimalPart === '') {
    formattedValue += decimalPart ? '.' + decimalPart : '.'
  }

  return separateThousands()(formattedValue)
}
