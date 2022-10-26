import {
  createTransactionService,
  type ExtractAbiResponse
} from '../../utils/transaction-library'
import { assign, createMachine, type DoneInvokeEvent } from 'xstate'
import { Buffer } from 'buffer'
import { mutateServer } from '@queries'
import { byteArrayFromHex, hash, hexStringFromByteArray } from '@utils'
import type { SendTransaction } from '@io/wallet'
import type { GlobalEntityId, TransactionReceipt } from '@io/gateway'

// Temporary for testing alphanet
const transaction = `
    CALL_METHOD
        ComponentAddress("system_tdx_a_1qsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs2ufe42")
        "lock_fee"
        Decimal("100");
  `

const createFullTransaction = (parsedWASM: ExtractAbiResponse) => {
  const codeHash: string = hexStringFromByteArray(
    hash(byteArrayFromHex(parsedWASM.code))
  )
  const abiHash: string = hexStringFromByteArray(
    hash(byteArrayFromHex(parsedWASM.abi))
  )
  return (
    transaction + `PUBLISH_PACKAGE Blob("${codeHash}") Blob("${abiHash}");\n`
  )
}

const upload = async (file: File) =>
  (await createTransactionService()).extract_abi({
    package_wasm: Buffer.from(await file.arrayBuffer()).toString('hex')
  })

type Context = {
  transaction: string
  parsedWASM?: ExtractAbiResponse
  transactionData?: SendTransaction
  receipt?: GlobalEntityId
}

type Events = { type: 'UPLOAD'; file: File } | { type: 'PUBLISH' }

type States =
  | {
      value: 'not-uploaded'
      context: Context & {
        parsedWASM: undefined
        transactionData: undefined
        receipt: undefined
      }
    }
  | {
      value: 'uploading'
      context: Context & {
        parsedWASM: undefined
        transactionData: undefined
        receipt: undefined
      }
    }
  | {
      value: 'unpublished'
      context: Context & {
        parsedWASM: ExtractAbiResponse
        transactionData: undefined
        receipt: undefined
      }
    }
  | {
      value: 'publishing'
      context: Context & {
        parsedWASM: ExtractAbiResponse
        receipt: undefined
      }
    }
  | {
      value: 'published'
      context: Context & {
        parsedWASM: ExtractAbiResponse
        transactionData: SendTransaction
        receipt: undefined
      }
    }
  | {
      value: 'final'
      context: Context & {
        parsedWASM: ExtractAbiResponse
        transactionData: SendTransaction
        receipt: GlobalEntityId
      }
    }

export const stateMachine = createMachine<Context, Events, States>(
  {
    id: 'deploy-package',
    initial: 'not-uploaded',
    predictableActionArguments: true,
    context: {
      transaction,
      parsedWASM: undefined,
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
            target: 'unpublished',
            actions: assign({
              parsedWASM: (_, event) => event.data
            })
          }
        }
      },
      unpublished: {
        entry: assign({
          transaction: (ctx) => {
            if (!ctx.parsedWASM) {
              throw new Error('Unexpected state')
            }
            return createFullTransaction(ctx.parsedWASM)
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
          }
        }
      },
      published: {
        invoke: {
          id: 'published',
          src: 'getReceipt',
          onDone: {
            target: 'final',
            actions: assign({
              receipt: (_, event: DoneInvokeEvent<TransactionReceipt>) =>
                event.data.committed.receipt.state_updates
                  .new_global_entities[0]
            })
          }
        }
      },
      final: {}
    }
  },
  {
    services: {
      getReceipt: (ctx) =>
        mutateServer(
          'transactionReceipt',
          ctx.transactionData?.transactionHash
        ),
      publish: (ctx) => {
        if (!ctx.parsedWASM) {
          throw new Error('Missing parsed WASM')
        }
        return mutateServer('sendTransaction', {
          transactionManifest: ctx.transaction,
          blobs: [ctx.parsedWASM.abi, ctx.parsedWASM.code]
        })
      },
      upload: (_, event) => {
        if (event.type !== 'UPLOAD') {
          throw new Error('Unexpected event')
        }
        return upload(event.file)
      }
    }
  }
)
