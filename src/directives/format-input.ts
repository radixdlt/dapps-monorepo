import numbro from 'numbro'

export const format = (
  node: HTMLInputElement,
  formatFunction: (value: string) => string
) => {
  function updateValue() {
    node.value = formatFunction(node.value)
  }

  node.addEventListener('input', updateValue)
  node.addEventListener('paste', updateValue)

  node.value = formatFunction(node.value)

  return {
    destroy() {
      node.removeEventListener('input', updateValue)
      node.removeEventListener('paste', updateValue)
    }
  }
}

export const number =
  (min?: number, max?: number, decimalPlaces = 2) =>
  (value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')

    // Split the value into integer and decimal parts
    const parts = numericValue.split('.')

    let integerPart = parts[0]
    let decimalPart = parts[1]

    // Remove leading zeros from the integer part
    integerPart = numbro(Number(integerPart.replace(/^0+/, ''))).format({
      thousandSeparated: true
    })

    // Limit the number of decimal places
    if (decimalPart || decimalPart === '') {
      decimalPart = decimalPart.slice(0, decimalPlaces)
    }

    // Combine the integer and decimal parts
    let formattedValue = integerPart
    if (decimalPart) {
      formattedValue += '.' + decimalPart
    }

    if (decimalPart === '') {
      formattedValue += '.'
    }

    // Apply minimum and maximum value constraints
    const numericFormattedValue = parseFloat(formattedValue)
    if (!isNaN(numericFormattedValue)) {
      if (min) {
        formattedValue = Math.max(numericFormattedValue, min).toString()
      }
      if (max) {
        formattedValue = Math.min(numericFormattedValue, max).toString()
      }
    }

    return formattedValue
  }
