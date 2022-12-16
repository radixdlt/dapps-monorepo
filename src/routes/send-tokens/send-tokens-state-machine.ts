import { assign, createMachine, send, type DoneInvokeEvent } from 'xstate'
import { accountStateMachine } from '@stateMachines'
import type { TransformWithOverview } from '@stateMachines/transformers'
import { mutateServer } from '@queries'

const getSendtokenManifest = ({
  resource,
  fromAccount,
  toAccount,
  amount
}: {
  resource: string
  fromAccount: string
  toAccount: string
  amount: number
}) =>
  `
  CALL_METHOD 
      ComponentAddress("${fromAccount}") 
      "withdraw_by_amount"
      Decimal("${amount}")             
      ResourceAddress("${resource}");
  
    CALL_METHOD
      ComponentAddress("${toAccount}") 
      "deposit_batch"
      Expression("ENTIRE_WORKTOP");
`

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
  | {
      type: 'SENDTOKEN'
      data: {
        resource: string
        fromAccount: string
        toAccount: string
        amount: number
      }
    }

type States =
  | {
      value: 'not-logged-in'
      context: Context & {
        sendingAccountId?: unknown
        transformedOverview?: unknown
      }
    }
  | {
      value: 'sending-token'
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
            target: 'idle',
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
          },
          SENDTOKEN: {
            target: 'sending-token'
          }
        }
      },
      'sending-token': {
        invoke: {
          src: 'sendToken',
          onDone: 'final',
          onError: {
            target: 'error',
            actions: assign({
              error: (_, event: DoneInvokeEvent<Error>) => event.data
            })
          }
        }
      },
      error: {
        on: {
          RETRY: {
            target: 'idle'
          }
        }
      },
      final: {
        on: {
          RETRY: {
            target: 'idle'
          }
        }
      }
    }
  },
  {
    services: {
      sendToken: (_, e) => {
        if (e.type !== 'SENDTOKEN') {
          throw new Error('Invalid event')
        }
        return mutateServer('sendTransaction', {
          transactionManifest: getSendtokenManifest(e.data)
        })
      }
    }
  }
)
