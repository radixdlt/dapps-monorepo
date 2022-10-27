import { interpret } from 'xstate'
import { stateMachine } from './deploy-package-state-machine'

describe('#deploy state machine', () => {
  it('should transition to uploading', () => {
    const actualState = stateMachine.transition('not-uploaded', 'UPLOAD')
    expect(actualState.matches('uploading')).toBeTruthy()
  })

  it('should transition to publishing', () => {
    const actualState = stateMachine.transition('uploaded', 'PUBLISH')
    expect(actualState.matches('publishing')).toBeTruthy()
  })

  it('Should transition all the way to final', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        upload: () => Promise.resolve({ code: 'code', abi: 'abi' }),
        publish: () => Promise.resolve(),
        getReceipt: () =>
          Promise.resolve({
            committed: {
              receipt: { state_updates: { new_global_entities: [] } }
            }
          })
      }
    })
    const fetchMachine = interpret(mockToggleMachine).onTransition((state) => {
      fetchMachine.start()
      fetchMachine.send('UPLOAD')

      if (state.matches('uploaded')) {
        fetchMachine.send('PUBLISH')
      }

      if (state.matches('final')) {
        expect(state.matches('final')).toBeTruthy()
      }
    })
  })
})
