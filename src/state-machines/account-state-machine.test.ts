import { interpret } from 'xstate'
import { stateMachine } from './account-state-machine'

vi.mock('$env/static/public', () => ({
  PUBLIC_NETWORK_NAME: 'hammunet'
}))

describe('#deploy state machine', () => {
  it('should transition to uploading', () => {
    const actualState = stateMachine.transition('idle', 'LOAD')
    expect(actualState.matches('fetching-resources')).toBeTruthy()
  })

  it('Should transition all the way to final', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        fetchingResources: () =>
          Promise.resolve({ fungible: [], nonFungible: [] }),
        fetchingOverview: () =>
          Promise.resolve({
            nonFungible: { withOverviews: [], withoutOverviews: [] },
            fungible: { withOverviews: [], withoutOverviews: [] }
          })
      }
    })

    const fetchMachine = interpret(mockToggleMachine).onTransition((state) => {
      if (state.matches('fetched-overview')) {
        expect(state.matches('fetched-overview')).toBeTruthy()
      }

      if (state.matches('fetched-resources')) {
        expect(state.matches('fetched-resources')).toBeTruthy()
      }

      if (state.matches('fetched-overview')) {
        expect(state.matches('fetched-overview')).toBeTruthy()
      }
    })
    fetchMachine.start()
    fetchMachine.send('LOAD')
  })

  it('Should go to failure state when upload fails', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        fetchingResources: () =>
          Promise.reject(new Error('Failed to fetch resources')),
        fetchingOverview: () =>
          Promise.resolve({
            nonFungible: { withOverviews: [], withoutOverviews: [] },
            fungible: { withOverviews: [], withoutOverviews: [] }
          })
      }
    })
    const fetchMachine = interpret(mockToggleMachine).onTransition((state) => {
      if (state.matches('error')) {
        try {
          expect(state.context.error.message).toEqual(
            'Failed to fetch resources'
          )
        } catch (e) {
          console.log(e)
        }
      }
    })
    fetchMachine.start()
    fetchMachine.send('LOAD')
  })

  it('Should error on publish fail', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        fetchingResources: () =>
          Promise.resolve({ fungible: [], nonFungible: [] }),
        fetchingOverview: () =>
          Promise.reject(new Error('Failed to fetch overview'))
      }
    })
    const fetchMachine = interpret(mockToggleMachine).onTransition((state) => {
      if (state.matches('error')) {
        try {
          expect(state.context.error.message).toEqual(
            'Failed to fetch overview'
          )
        } catch (e) {
          console.log(e)
        }
      }
    })
    fetchMachine.send('LOAD')
    fetchMachine.start()
  })
})
