import {
  capitalize,
  shortenAddress,
  toWholeUnits,
  isSameRoute,
  getFileExtension,
  bufferFromHex,
  hash,
  getAddressType,
  getTxIdFromMessage,
  accountLabel
} from './utils'

describe('#utils', () => {
  it('should extract txId from error', () => {
    const message = 'TxID: abc'
    const result = getTxIdFromMessage(message)
    expect(result).toBe('abc')
  })

  it('should return undefined if message is different', () => {
    const message = 'any message '
    const result = getTxIdFromMessage(message)
    expect(result).toBeUndefined()
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
    const result = getAddressType(address)
    expect(result).toEqual(expected)
  })

  describe('accountLabel', () => {
    it('should format account label', () => {
      const account = {
        label: 'Main Account',
        address:
          'account_tdx_b_1pqdy2mvxrkyycaj0c8c2g8xekf3me27f3hvl9q52cqcs7x2w96'
      }
      expect(accountLabel(account)).toBe('Main Account (acco...7x2w96)')
    })
  })
})
