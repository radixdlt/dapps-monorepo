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

export const number = (min?: number, max?: number) => (value: string) => {
  let number = value.replace(/\D/g, '')

  if (number === '') return number
  if (min) number = Math.max(min, parseInt(number)).toString()
  if (max) number = Math.min(max, parseInt(number)).toString()

  return number
}
