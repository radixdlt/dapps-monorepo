import { includesString } from './filters'

describe('#filter functions for table', () => {
  it('Should return true for string match', () => {
    const row = { original: { name: 'test' } }
    expect(
      includesString(row as any, '', 'test', undefined as any)
    ).toBeTruthy()
  })

  it('Should return false no string match', () => {
    const row = { original: { name: 'test' } }
    expect(
      includesString(row as any, '', 'no match', undefined as any)
    ).toBeFalsy()
  })
})
