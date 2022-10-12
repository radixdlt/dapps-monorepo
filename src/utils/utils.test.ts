import {
  capitalize,
  shortenAddress,
  toWholeUnits,
  isSameRoute,
  hexStringFromByteArray,
  byteArrayFromHex,
  hash
} from './utils'

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

  it('Should capitalize', () => {
    const originalText = 'hello world'
    const expected = 'Hello world'
    const result = capitalize(originalText)
    expect(result).toEqual(expected)
  })

  it('Should return true if same route', () => {
    const route = '/swap'
    const expected = true
    const result = isSameRoute(route, 'swap')
    expect(result).toEqual(expected)
  })

  it('Should convert hex string from byte array', () => {
    const byteArray = new Uint8Array([1, 2, 3, 4])
    const expected = '01020304'
    const result = hexStringFromByteArray(byteArray)
    expect(result).toEqual(expected)
  })

  it('Should convert byte array from hex string', () => {
    const hex = '01020304'
    const expected = new Uint8Array([1, 2, 3, 4])
    const result = byteArrayFromHex(hex)
    expect(result).toEqual(expected)
  })

  it('Should return a sha256 hash from byte array', () => {
    const byteArray = new Uint8Array([1, 2, 3, 4])
    const expected = new Uint8Array([
      159, 100, 167, 71, 225, 185, 127, 19, 31, 171, 182, 180, 71, 41, 108, 155,
      111, 2, 1, 231, 159, 179, 197, 53, 110, 108, 119, 232, 155, 106, 128, 106
    ])
    const result = hash(byteArray)
    expect(result).toEqual(expected)
  })
})
