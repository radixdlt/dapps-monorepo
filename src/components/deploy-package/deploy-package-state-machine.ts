import { assign, createMachine, type DoneInvokeEvent } from 'xstate'
import { Buffer } from 'buffer'
import { mutateServer } from '@queries'
import { hash } from '@utils'
import type { SendTransaction } from '@io/wallet'
import type { GlobalEntityId } from '@io/gateway'

// Temporary for testing alphanet
// TODO: replace with address of the system contract
const transaction = `
    CALL_METHOD
        ComponentAddress("system_tdx_a_1qsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs2ufe42") 
        "lock_fee"
        Decimal("100");
  `

const createFullTransaction = (wasm: string, abi: string) => {
  const codeHash: string = hash(wasm).toString('hex')
  const abiHash: string = hash(abi).toString('hex')
  return (
    transaction + `PUBLISH_PACKAGE Blob("${codeHash}") Blob("${abiHash}");\n`
  )
}

type Context = {
  transaction: string
  wasm?: string
  abi?: string
  error?: Error
  transactionData?: SendTransaction
  receipt?: GlobalEntityId
}

type Events =
  | { type: 'UPLOAD'; abi: File; wasm: File }
  | { type: 'PUBLISH' }
  | { type: 'RETRY' }

type States =
  | {
      value: 'not-uploaded'
      context: Context & {
        wasm: undefined
        abi: undefined
        transactionData: undefined
        receipt: undefined
      }
    }
  | {
      value: 'uploading'
      context: Context & {
        wasm: undefined
        abi: undefined
        transactionData: undefined
        receipt: undefined
      }
    }
  | {
      value: 'uploaded'
      context: Context & {
        wasm: string
        abi: string
        transactionData: undefined
        receipt: undefined
      }
    }
  | {
      value: 'publishing'
      context: Context & {
        wasm: string
        abi: string
        receipt: undefined
      }
    }
  | {
      value: 'published'
      context: Context & {
        wasm: string
        abi: string
        transactionData: SendTransaction
        receipt: undefined
      }
    }
  | {
      value: 'final'
      context: Context & {
        wasm: string
        abi: string
        transactionData: SendTransaction
        receipt: GlobalEntityId
      }
    }
  | {
      value: 'error'
      context: Context & {
        error: string
      }
    }

export const stateMachine = createMachine<Context, Events, States>(
  {
    id: 'deploy-package',
    initial: 'not-uploaded',
    predictableActionArguments: true,
    context: {
      transaction,
      wasm: undefined,
      abi: undefined,
      error: undefined,
      transactionData: undefined,
      receipt: undefined
    },
    states: {
      'not-uploaded': {
        on: { UPLOAD: { target: 'uploading' } }
      },
      uploading: {
        invoke: {
          id: 'uploading',
          src: 'upload',
          onDone: {
            target: 'uploaded',
            actions: assign({
              wasm: (
                _,
                event: DoneInvokeEvent<{ wasm: string; abi: string }>
              ) => event.data.wasm,
              abi: (_, event: DoneInvokeEvent<{ wasm: string; abi: string }>) =>
                event.data.abi
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
      uploaded: {
        entry: assign({
          transaction: (ctx) => {
            if (!ctx.wasm || !ctx.abi) {
              throw new Error('Unexpected state')
            }
            return createFullTransaction(ctx.wasm, ctx.abi)
          }
        }),
        on: { PUBLISH: { target: 'publishing' } }
      },
      publishing: {
        invoke: {
          id: 'publishing',
          src: 'publish',
          onDone: {
            target: 'published',
            actions: assign({
              transactionData: (_, event: DoneInvokeEvent<SendTransaction>) =>
                event.data
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
      published: {},
      error: {
        on: { RETRY: { target: 'not-uploaded' } }
      },
      final: {}
    }
  },
  {
    services: {
      publish: async (ctx) => {
        if (!ctx.wasm || !ctx.abi) {
          throw new Error('Unexpected state')
        }
        return mutateServer('sendTransaction', {
          transactionManifest: ctx.transaction,
          blobs: [ctx.wasm, ctx.abi]
        })
      },
      upload: async (_, event) => {
        if (event.type !== 'UPLOAD') {
          throw new Error('Unexpected event')
        }
        const wasm = Buffer.from(await event.wasm.arrayBuffer()).toString('hex')
        const abi = Buffer.from(await event.abi.arrayBuffer()).toString('hex')

        return { wasm, abi }
      }
    }
  }
)
