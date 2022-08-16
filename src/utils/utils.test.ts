import { shortenAddress, toWholeUnits } from './utils'

describe('#utils', () => {
  it('Should shorten address', () => {
    const originalAddress = '01234----56789'
    const expected = '01234...6789'
    const result = shortenAddress(originalAddress)
    expect(result).toEqual(expected)
  })

  it('Should return whole units', () => {
    const originalValue = '100000000000000000000'
    const expected = 100
    const result = toWholeUnits(originalValue)
    expect(result).toEqual(expected)
  })
})
