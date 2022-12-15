import { assign, createMachine, type DoneInvokeEvent } from 'xstate'
import { Buffer } from 'buffer'
import { mutateServer, queryServer } from '@queries'
import { hash } from '@utils'
import type { SendTransaction } from '@io/wallet'

const getCreateBadgeManifest = (accountAddress: string) => `
  CREATE_RESOURCE 
      Enum(
          "NonFungible", 
          Enum("U32")
      ) 
      Array<Tuple>(
          Tuple("name", "MyResource"), 
          Tuple("symbol", "RSRC"),
          Tuple("description", "A very innovative and important resource"), 
      ) 
      Array<Tuple>(
          Tuple(Enum("Withdraw"), Tuple(Enum("AllowAll"), Enum("DenyAll"))),
          Tuple(Enum("Deposit"), Tuple(Enum("AllowAll"), Enum("DenyAll")))
      )
      Some(
          Enum(
              "NonFungible", 
              Array<Tuple>(
                  Tuple(NonFungibleId(1u32), Tuple(Bytes("5c2100"), Bytes("5c2100")))
              )
          )
      );
  CALL_METHOD
      ComponentAddress("${accountAddress}") 
      "deposit_batch"
      Expression("ENTIRE_WORKTOP");
`

const getDeployPackageManifest = (
  wasm: string,
  abi: string,
  accountAddress: string,
  nftAddress: string
) => {
  const codeHash: string = hash(wasm).toString('hex')
  const abiHash: string = hash(abi).toString('hex')
  return `
      PUBLISH_PACKAGE_WITH_OWNER 
        Blob("${codeHash}") 
        Blob("${abiHash}")
        NonFungibleAddress("${nftAddress}", 1u32);

      CALL_METHOD 
        ComponentAddress("${accountAddress}") 
        "deposit_batch" 
        Expression("ENTIRE_WORKTOP");
      `
}

type Context = {
  deployPackageManifest?: string
  wasm?: string
  abi?: string
  error?: Error
  transactionData?: SendTransaction
  selectedAccountAddress?: string
  selectedNftAddress?: string
  non_fungible_resources: Array<{
    address: string
    total_count: number
  }>
  intentHash?: string
}

type Events =
  | { type: 'UPLOAD_FILES'; abi: File; wasm: File }
  | { type: 'REMOVE_FILE' }
  | { type: 'SELECT_ACCOUNT'; accountAddress: string }
  | { type: 'SELECT_BADGE'; badgeAddress: string }
  | { type: 'CREATE_BADGE' }
  | { type: 'DEPLOY' }
  | { type: 'RETRY' }
  | { type: 'CONNECT' }

type States =
  | {
      value:
        | 'not-connected'
        | 'connected'
        | {
            connected:
              | {
                  'selecting-account':
                    | 'idle'
                    | 'selected'
                    | 'creating-badge'
                    | { selected: 'idle' | 'fetching-resources' }
                }
              | { 'selecting-badge': 'idle' | 'selected' }
              | { 'uploading-files': 'idle' | 'uploading' | 'uploaded' }
              | { 'deploying-package': 'success' | 'deploy' }
          }
      context: Context
    }
  | {
      value: 'error'
      context: Context & {
        error: Error
      }
    }

export const stateMachine = createMachine<Context, Events, States>(
  {
    id: 'deploy-package',
    initial: 'not-connected',
    predictableActionArguments: true,
    context: {
      deployPackageManifest: undefined,
      wasm: undefined,
      abi: undefined,
      error: undefined,
      transactionData: undefined,
      intentHash: undefined,
      non_fungible_resources: []
    },
    states: {
      'not-connected': {
        on: { CONNECT: { target: 'connected' } }
      },
      connected: {
        on: {
          CONNECT: { target: '.' },
          SELECT_ACCOUNT: {
            target: ['.selecting-account.selected', '.selecting-badge.idle'],
            actions: assign({
              selectedAccountAddress: (_, event) => event.accountAddress,
              selectedNftAddress: (_, __) => undefined,
              non_fungible_resources: (_, __) => []
            })
          },
          SELECT_BADGE: {
            target: '.selecting-badge.selected',
            actions: assign({
              selectedNftAddress: (_, event) => event.badgeAddress
            })
          },
          DEPLOY: {
            target: '.deploying-package.deploy',
            cond: (ctx) =>
              ctx.wasm &&
              ctx.abi &&
              ctx.selectedAccountAddress &&
              ctx.selectedNftAddress
                ? true
                : false
          }
        },
        type: 'parallel',
        states: {
          'selecting-account': {
            initial: 'idle',
            on: {
              CREATE_BADGE: '.creating-badge'
            },
            states: {
              idle: {},
              selected: {
                initial: 'fetching-resources',
                states: {
                  idle: {},
                  'fetching-resources': {
                    invoke: {
                      src: 'queryResources',
                      onDone: {
                        target: 'idle',
                        actions: assign({
                          non_fungible_resources: (_, event) => event.data ?? []
                        })
                      },
                      onError: {
                        target: '..error',
                        actions: assign({
                          error: (_, event: DoneInvokeEvent<Error>) =>
                            event.data
                        })
                      }
                    }
                  }
                }
              },
              'creating-badge': {
                invoke: {
                  src: 'createBadge',
                  onDone: 'selected',
                  onError: {
                    target: '..error',
                    actions: assign({
                      error: (_, event: DoneInvokeEvent<Error>) => event.data
                    })
                  }
                }
              }
            }
          },
          'selecting-badge': {
            initial: 'idle',
            states: {
              idle: {},
              selected: {}
            }
          },
          'uploading-files': {
            on: {
              UPLOAD_FILES: '.uploading',
              REMOVE_FILE: '.idle'
            },
            initial: 'idle',
            states: {
              idle: {},
              uploading: {
                invoke: {
                  src: 'upload',
                  onDone: {
                    target: 'uploaded',
                    actions: assign({
                      wasm: (_, event) => event.data.wasm,
                      abi: (_, event) => event.data.abi
                    })
                  }
                }
              },
              uploaded: {}
            }
          },
          'deploying-package': {
            initial: 'idle',
            states: {
              idle: {},
              deploy: {
                invoke: {
                  src: 'deploy',
                  onDone: {
                    target: 'success',
                    actions: assign({
                      intentHash: (_, event: DoneInvokeEvent<string>) =>
                        event.data
                    })
                  },
                  onError: {
                    target: '..error',
                    actions: assign({
                      error: (_, event: DoneInvokeEvent<Error>) => event.data
                    })
                  }
                }
              },
              success: {}
            }
          }
        }
      },
      error: {}
    }
  },
  {
    services: {
      queryResources: ({ selectedAccountAddress }) =>
        queryServer('getEntityResources', selectedAccountAddress).then(
          ({ nonFungible }) => nonFungible
        ),
      deploy: (ctx) => {
        if (
          !ctx.wasm ||
          !ctx.abi ||
          !ctx.selectedAccountAddress ||
          !ctx.selectedNftAddress
        ) {
          throw new Error('Unexpected state')
        }
        return mutateServer('sendTransaction', {
          transactionManifest: getDeployPackageManifest(
            ctx.wasm,
            ctx.abi,
            ctx.selectedAccountAddress,
            ctx.selectedNftAddress
          ),
          blobs: [ctx.wasm, ctx.abi]
        }).then(({ transactionIntentHash }) => {
          console.log('TX intent hash: ', transactionIntentHash)
          return transactionIntentHash
        })
      },
      upload: async (_, event) => {
        if (event.type !== 'UPLOAD_FILES') throw new Error('Unexpected event')
        return {
          wasm: Buffer.from(await event.wasm.arrayBuffer()).toString('hex'),
          abi: Buffer.from(await event.abi.arrayBuffer()).toString('hex')
        }
      },
      createBadge: ({ selectedAccountAddress }) => {
        if (!selectedAccountAddress) throw Error('Unexpected state')

        return mutateServer('sendTransaction', {
          transactionManifest: getCreateBadgeManifest(selectedAccountAddress)
        })
      }
    }
  }
)
