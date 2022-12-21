import {
  capitalize,
  shortenAddress,
  toWholeUnits,
  isSameRoute,
  getFileExtension,
  bufferFromHex,
  hash,
  getAddressPrefix,
  getTxIdFromMessage
} from './utils'

describe('#utils', () => {
  it('should extract txId from error', () => {
    const message = 'TxID: abc'
    const result = getTxIdFromMessage(message)
    expect(result).toBe('abc')
  })

  it('should default to message if something goes wrong', () => {
    const message = 'TxID:abc'
    const result = getTxIdFromMessage(message)
    expect(result).toBe('TxID:abc')
  })

  it('Should shorten address', () => {
    const originalAddress = '01234----456789'
    const expected = '0123...456789'
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

  it('Should convert byte array from hex string', () => {
    const hex = '01020304'
    const expected = Buffer.from([1, 2, 3, 4])
    const result = bufferFromHex(hex)
    expect(result).toEqual(expected)
  })

  it('Should return a sha256 hash from byte array', () => {
    const hex = '01020304'
    const expected = Buffer.from([
      159, 100, 167, 71, 225, 185, 127, 19, 31, 171, 182, 180, 71, 41, 108, 155,
      111, 2, 1, 231, 159, 179, 197, 53, 110, 108, 119, 232, 155, 106, 128, 106
    ])
    const result = hash(hex)
    expect(result).toEqual(expected)
  })

  it('Should extract extension from filename', () => {
    const filename = 'test.txt'
    const expected = 'txt'
    const result = getFileExtension(filename)
    expect(result).toEqual(expected)
  })

  it('Should return prefix', () => {
    const address = 'transaction_1234'
    const expected = 'transaction'
    const result = getAddressPrefix(address)
    expect(result).toEqual(expected)
  })
})
