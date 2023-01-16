import { interpret } from 'xstate'
import { stateMachine } from './deploy-package-state-machine'

describe('#deploy state machine', () => {
  it('should transition from not-connected to connected', () => {
    expect(
      stateMachine
        .transition('connect.idle', 'CONNECT')
        .matches('connect.success')
    ).toBeTruthy()
  })

  it('should succeed transition from deploy.idle to deploy.pending', () => {
    expect(
      stateMachine
        .transition('deploy.idle', {
          type: 'DEPLOY',
          payload: {
            badge: {
              name: 'test',
              address: 'test',
              id: 'test'
            },
            account: 'account',
            wasm: 'wasm',
            abi: 'abi'
          }
        })
        .matches('deploy.pending')
    ).toBeTruthy()
  })

  it('should fail transition from deploy.idle to deploy.pending due to failed conditions', () => {
    expect(
      stateMachine
        .transition('deploy.idle', {
          type: 'DEPLOY',
          // @ts-ignore - this is a test
          payload: {
            badge: {
              name: 'test',
              address: 'test',
              id: 'test'
            },
            account: 'account',
            wasm: 'wasm'
          }
        })
        .matches('deploy.pending')
    ).toBeFalsy()
  })

  it('Should transition all the way to final', async () =>
    new Promise((resolve) => {
      const mockToggleMachine = stateMachine.withConfig({
        services: {
          deploy: () =>
            Promise.resolve({
              txID: 'txID',
              entities: [],
              badgeMetadata: [],
              badgeName: 'badgename'
            })
        }
      })

      const fetchMachine = interpret(mockToggleMachine).onTransition(
        (state) => {
          if (state.matches('deploy.pending')) {
            expect(state.matches('deploy.pending')).toBeTruthy()
          }
          if (state.matches('deploy.success')) {
            expect(state.matches('deploy.success')).toBeTruthy()
            resolve('done')
          }
        }
      )
      fetchMachine.start()
      fetchMachine.send({
        type: 'DEPLOY',
        payload: {
          badge: {
            name: 'test',
            address: 'test',
            id: 'test'
          },
          account: 'account',
          wasm: 'wasm',
          abi: 'abi'
        }
      })
    }))
})
