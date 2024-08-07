require('isomorphic-fetch')

vi.mock('$env/static/public', () => ({
  PUBLIC_NETWORK_NAME: 'hammunet',
  PUBLIC_APP_ENV: 'development'
}))

vi.mock('$env/static/public', () => ({
  PUBLIC_NETWORK_NAME: 'hammunet',
  PUBLIC_APP_ENV: 'development'
}))

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}))

vi.mock('$app/stores', async () => {
  const { readable, writable } = await import('svelte/store')
  /**
   * @type {import('$app/stores').getStores}
   */
  const getStores = () => ({
    navigating: readable(null),
    page: readable({ url: new URL('http://localhost'), params: {} }),
    session: writable(null),
    updated: readable(false)
  })
  /** @type {typeof import('$app/stores').page} */
  const page = {
    subscribe(fn) {
      return getStores().page.subscribe(fn)
    }
  }
  /** @type {typeof import('$app/stores').navigating} */
  const navigating = {
    subscribe(fn) {
      return getStores().navigating.subscribe(fn)
    }
  }
  /** @type {typeof import('$app/stores').session} */
  const session = {
    subscribe(fn) {
      return getStores().session.subscribe(fn)
    }
  }
  /** @type {typeof import('$app/stores').updated} */
  const updated = {
    subscribe(fn) {
      return getStores().updated.subscribe(fn)
    }
  }
  return {
    getStores,
    navigating,
    page,
    session,
    updated
  }
})
