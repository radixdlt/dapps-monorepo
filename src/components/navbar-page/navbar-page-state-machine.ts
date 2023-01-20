import { createMachine } from 'xstate'
import type { TransformWithOverview } from '@stateMachines/transformers'

type Context = {
  sendingAccountId?: string
  transformedOverview: {
    fungible: TransformWithOverview
    nonFungible: TransformWithOverview
  }
  txID?: string
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
      value: 'error'
      context: Context & {
        error: Error
      }
    }

export const stateMachine = createMachine<Context, Events, States>({
  id: 'send-tokens',
  initial: 'not-logged-in',
  predictableActionArguments: true,
  context: {
    sendingAccountId: undefined,
    transformedOverview: {
      fungible: [],
      nonFungible: []
    },
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
    idle: {}
  }
})
