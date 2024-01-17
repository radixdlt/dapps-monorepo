import { featureFlags } from './index'

describe('Feature flags', () => {
  it('Should set and get a list of flags', () => {
    const fakeflags = [
      { id: 'test 1', description: 'test description 1', enabled: false },
      { id: 'test 2', description: 'test description 2', enabled: true },
      { id: 'test 3', description: 'test description 3', enabled: false }
    ] as const

    const flags = featureFlags(fakeflags).get()
    expect(flags).toEqual(fakeflags)
  })

  it('Should return undefined if id is missing', () => {
    const fakeflags = [
      { id: 'test 1', description: 'test description 1', enabled: false }
    ] as const

    const flag = featureFlags(fakeflags).getFlag('x' as any)
    expect(flag?.enabled).toBe(undefined)
  })

  it('Should return true if flag is enabled', () => {
    const fakeflags = [
      { id: 'test 1', description: 'test description 1', enabled: true }
    ] as const

    const flag = featureFlags(fakeflags).getFlag('test 1')
    expect(flag?.enabled).toBe(true)
  })

  it('Should return false if flag is disabled', () => {
    const fakeflags = [
      { id: 'test 1', description: 'test description 1', enabled: false }
    ] as const

    const flag = featureFlags(fakeflags).getFlag('test 1')
    expect(flag?.enabled).toBe(false)
  })
})
