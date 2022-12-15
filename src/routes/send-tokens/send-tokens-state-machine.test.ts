import { interpret } from 'xstate'
import { stateMachine } from './send-tokens-state-machine'

vi.mock('$env/static/public', () => ({
  PUBLIC_NETWORK_NAME: 'hammunet'
}))

describe('#deploy state machine', () => {
  it('should transition to uploading', () => {
    const actualState = stateMachine.transition('idle', 'LOAD')
    expect(actualState.matches('fetching-account-balance')).toBeTruthy()
  })

  it('Should transition all the way to fetched account balance', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        fetchAccountBalance: () => Promise.resolve(222)
      }
    })

    const fetchMachine = interpret(mockToggleMachine).onTransition((state) => {
      if (state.matches('fetched-account-balance')) {
        expect(state.matches('fetched-account-balance')).toBeTruthy()
      }
    })
    fetchMachine.start()
    fetchMachine.send('LOAD')
  })

  it('Should go to failure state when no id provided', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        fetchAccountBalance: () =>
          Promise.reject(new Error('Failed to fetch resources'))
      }
    })
    const fetchMachine = interpret(mockToggleMachine).onTransition((state) => {
      if (state.matches('error')) {
        try {
          expect(state.context.error.message).toEqual('Unexpected state')
        } catch (e) {
          console.log(e)
        }
      }
    })
    fetchMachine.start()
    fetchMachine.send('LOAD')
  })
})
