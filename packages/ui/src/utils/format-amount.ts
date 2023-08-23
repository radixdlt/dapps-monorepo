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
