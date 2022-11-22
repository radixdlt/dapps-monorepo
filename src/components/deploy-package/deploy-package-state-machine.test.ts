import { interpret } from 'xstate'
import { stateMachine } from './deploy-package-state-machine'

vi.mock('$env/static/public', () => ({
  PUBLIC_NETWORK_NAME: 'hammunet'
}))

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
        upload: () => Promise.resolve({ wasm: 'wasm', abi: 'abi' }),
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
      if (state.matches('uploaded')) {
        fetchMachine.send('PUBLISH')
      }

      if (state.matches('final')) {
        expect(state.matches('final')).toBeTruthy()
      }
    })
    fetchMachine.start()
    fetchMachine.send('UPLOAD')
  })

  it('Should go to failure state when upload fails', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        upload: () => Promise.reject(new Error('Upload failed')),
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
      if (state.matches('uploaded')) {
        fetchMachine.send('PUBLISH')
      }

      if (state.matches('error')) {
        try {
          expect(state.context.error.message).toEqual('Upload failed')
        } catch (e) {
          console.log(e)
        }
      }
    })
    fetchMachine.start()
    fetchMachine.send('UPLOAD')
  })

  it('Should error on publish fail', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        upload: () => Promise.resolve({ wasm: 'wasm', abi: 'abi' }),
        publish: () => Promise.reject(new Error('Publish failed')),
        getReceipt: () =>
          Promise.resolve({
            committed: {
              receipt: { state_updates: { new_global_entities: [] } }
            }
          })
      }
    })
    const fetchMachine = interpret(mockToggleMachine).onTransition((state) => {
      if (state.matches('uploaded')) {
        fetchMachine.send('PUBLISH')
      }

      if (state.matches('error')) {
        try {
          expect(state.context.error.message).toEqual('Publish failed')
        } catch (e) {
          console.log(e)
        }
      }
    })
    fetchMachine.send('UPLOAD')
    fetchMachine.start()
  })

  it('Should error on get receipt fail', () => {
    const mockToggleMachine = stateMachine.withConfig({
      services: {
        upload: () => Promise.resolve({ wasm: 'wasm', abi: 'abi' }),
        publish: () => Promise.resolve(),
        getReceipt: () => Promise.reject(new Error('Get receipt failed'))
      }
    })
    const fetchMachine = interpret(mockToggleMachine).onTransition((state) => {
      if (state.matches('uploaded')) {
        fetchMachine.send('PUBLISH')
      }

      if (state.matches('error')) {
        try {
          expect(state.context.error.message).toEqual('Get receipt failed')
        } catch (e) {
          console.log(e)
        }
      }
    })
    fetchMachine.send('UPLOAD')
    fetchMachine.start()
  })
})
