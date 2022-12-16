import { assign, createMachine, send, type DoneInvokeEvent } from 'xstate'
import { accountStateMachine } from '@stateMachines'
import type { TransformWithOverview } from '@stateMachines/transformers'

type Context = {
  sendingAccountId?: string
  transformedOverview?: {
    fungible: TransformWithOverview
    nonFungible: TransformWithOverview
  }
  error?: Error
}

type Events =
  | { type: 'LOAD'; address: string }
  | { type: 'RETRY' }
  | { type: 'LOGGEDIN' }

type States =
  | {
      value: 'not-logged-in'
      context: Context & {
        sendingAccountId?: unknown
        transformedOverview?: unknown
      }
    }
  | {
      value: 'idle'
      context: Context & {
        sendingAccountId?: unknown
        transformedOverview?: unknown
      }
    }
  | {
      value: 'final'
      context: Context & {
        fungible: TransformWithOverview
        nonFungible: TransformWithOverview
      }
    }
  | {
      value: 'error'
      context: Context & {
        error: Error
      }
    }

export const stateMachine = createMachine<Context, Events, States>(
  {
    id: 'send-tokens',
    initial: 'not-logged-in',
    predictableActionArguments: true,
    context: {
      sendingAccountId: undefined,
      transformedOverview: undefined,
      error: undefined
    },
    states: {
      'not-logged-in': {
        on: {
          LOGGEDIN: {
            target: 'idle'
          }
        }
      },
      idle: {
        invoke: {
          id: 'child',
          src: accountStateMachine,
          onDone: {
            target: 'final',
            actions: assign({
              transformedOverview: (
                _,
                event: DoneInvokeEvent<{
                  fungible: TransformWithOverview
                  nonFungible: TransformWithOverview
                }>
              ) => event.data
            })
          },
          onError: {
            target: 'error',
            actions: assign({
              error: (_, event: DoneInvokeEvent<Error>) => event.data
            })
          }
        },
        on: {
          LOAD: {
            actions: send((_, event) => ({ ...event, isChild: true }), {
              to: 'child'
            })
          }
        }
      },
      error: {
        on: {
          LOAD: {
            target: 'idle'
          }
        }
      },
      final: {
        on: {
          LOAD: {
            target: 'idle'
          }
        }
      }
    }
  },
  {
    services: {}
  }
)
