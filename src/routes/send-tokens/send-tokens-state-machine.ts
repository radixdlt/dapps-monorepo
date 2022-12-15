import { assign, createMachine, type DoneInvokeEvent } from 'xstate'

type Context = {
  sendingAccountId?: string
  tokenBalance?: number
  error?: Error
}

type Events = { type: 'LOAD'; address: string } | { type: 'RETRY' }

type States =
  | {
      value: 'idle'
      context: Context & {
        sendingAccountId?: unknown
        tokenBalance?: unknown
      }
    }
  | {
      value: 'fetching-account-balance'
      context: Context & {
        sendingAccountId?: unknown
        tokenBalance?: unknown
      }
    }
  | {
      value: 'fetched-account-balance'
      context: Context & {
        sendingAccountId?: unknown
        tokenBalance?: unknown
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
    initial: 'idle',
    predictableActionArguments: true,
    context: {
      sendingAccountId: undefined,
      tokenBalance: undefined,
      error: undefined
    },
    states: {
      idle: {
        on: { LOAD: { target: 'fetching-account-balance' } }
      },
      'fetching-account-balance': {
        invoke: {
          id: 'fetching-account-balance',
          src: 'fetchAccountBalance',
          onDone: {
            target: 'fetched-account-balance',
            actions: assign({
              tokenBalance: (_, event: DoneInvokeEvent<number>) => event.data
            })
          },
          onError: {
            target: 'error',
            actions: assign({
              error: (_, event: DoneInvokeEvent<Error>) => event.data
            })
          }
        }
      },
      'fetched-account-balance': {},
      error: {
        on: { RETRY: { target: 'fetching-account-balance' } }
      }
    }
  },
  {
    services: {
      fetchAccountBalance: async (ctx) => {
        if (!ctx.sendingAccountId) {
          throw new Error('Unexpected state')
        }

        return 33
      }
    }
  }
)
