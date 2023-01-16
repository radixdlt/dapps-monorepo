import { assign, createMachine, type DoneInvokeEvent } from 'xstate'
import { Buffer } from 'buffer'
import { mutateServer, queryServer } from '@queries'
import type { SendTransaction } from '@io/wallet'

const getCreateBadgeManifest = (accountAddress: string) => `
  CREATE_RESOURCE 
      Enum(
          "NonFungible", 
          Enum("U32")
      ) 
      Array<Tuple>(
          Tuple("name", "My Package Owner Badge"), 
          Tuple("description", "This NFT was created by the Radix Dashboard as a simple badge to be used for default package control permissions. There is nothing special about it - swap it out, or create your own"), 
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

type Context = {
  deployPackageManifest?: string
  wasm?: string
  abi?: string
  error?: Error
  transactionData?: SendTransaction
  selectedAccountAddress?: string
  non_fungible_resources: Array<{
    name?: string
    address: string
    id: string
  }>
  intentHash?: string
  badgeMetadata?: Array<{
    key: string
    value: string
  }>
  packageAddress?: string
  selectedNft?: {
    name?: string
    address: string
    id: string
  }
  createdBadgeTxID?: string
}

type Events =
  | { type: 'UPLOAD_FILES'; abi: File; wasm: File }
  | { type: 'REMOVE_FILE' }
  | { type: 'SELECT_ACCOUNT'; address?: string }
  | { type: 'SELECT_BADGE'; index: number }
  | { type: 'CREATE_BADGE' }

type States =
  | {
      value: 'inputs.account-selected.success'
      context: Context & {
        selectedAccountAddress: string
      }
    }
  | {
      value: 'inputs.uploading-files.success'
      context: Context & {
        abi: string
        wasm: string
        selectedAccountAddress: string
        selectedNft: {
          name?: string
          address: string
          id: string
        }
      }
    }
  | {
      value: 'inputs.badge-selected.success'
      context: Context & {
        selectedNft: {
          name?: string
          address: string
          id: string
        }
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
    id: 'deploy-package-form',
    predictableActionArguments: true,
    initial: 'inputs',
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
      idle: {},
      inputs: {
        type: 'parallel',
        states: {
          'creating-badge': {
            initial: 'idle',
            states: {
              pending: {
                invoke: {
                  src: 'createBadge',
                  onDone: {
                    target: 'idle',
                    actions: assign({
                      createdBadgeTxID: (_, event) =>
                        event.data.transactionIntentHash
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
              idle: {
                type: 'final'
              }
            }
          },
          'badge-selected': {
            initial: 'idle',
            states: {
              idle: {},
              success: {
                type: 'final'
              }
            }
          },
          'account-selected': {
            initial: 'idle',
            states: {
              pending: {
                invoke: {
                  src: 'queryResources',
                  onDone: {
                    target: 'success',
                    actions: assign({
                      non_fungible_resources: (_, event) => event.data ?? []
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
              idle: { type: 'final' },
              error: {},
              success: { type: 'final' }
            }
          },
          'uploading-files': {
            initial: 'idle',
            states: {
              pending: {
                invoke: {
                  src: 'upload',
                  onDone: {
                    target: 'success',
                    actions: assign({
                      wasm: (_, event) => event.data.wasm,
                      abi: (_, event) => event.data.abi
                    })
                  }
                }
              },
              success: { type: 'final' },
              idle: {}
            }
          }
        },
        onDone: {},
        on: {
          UPLOAD_FILES: 'inputs.uploading-files.pending',
          REMOVE_FILE: {
            target: 'inputs.uploading-files.idle',
            actions: assign({
              wasm: (_, __) => undefined,
              abi: (_, __) => undefined
            })
          },
          CREATE_BADGE: {
            target: 'inputs.creating-badge.pending',
            cond: 'hasSelectedAccount'
          },
          SELECT_BADGE: {
            target: 'inputs.badge-selected.success',
            cond: 'hasSelectedAccount',
            actions: assign({
              selectedNft: (ctx, event) =>
                ctx.non_fungible_resources[event.index]
            })
          },
          SELECT_ACCOUNT: {
            target: [
              'inputs.account-selected.pending',
              'inputs.badge-selected.idle'
            ],
            actions: assign({
              selectedAccountAddress: (context, event) => {
                if (!event.address) {
                  return context.selectedAccountAddress
                }

                return event.address
              },
              selectedNft: (_, __) => undefined,
              non_fungible_resources: (_, __) => []
            })
          }
        }
      },
      error: {}
    }
  },
  {
    services: {
      queryResources: async ({ selectedAccountAddress }) => {
        const { nonFungible } = await queryServer(
          'getEntityResources',
          selectedAccountAddress
        )
        if (!nonFungible) return undefined

        const nonFungiblesWithNames = await Promise.all(
          nonFungible.map(async (nft) => ({
            ...nft,
            name: await queryServer('getEntityDetails', nft.address).then(
              (response) =>
                response.metadata.items.find((item) => item.key === 'name')
                  ?.value
            )
          }))
        )

        const nfts = await Promise.all(
          nonFungiblesWithNames.map(async (nft) => ({
            name: nft.name,
            ...(await queryServer('getEntityNonFungibleIDs', {
              accountAddress: selectedAccountAddress || '',
              nftAddress: nft.address
            }))
          }))
        )

        return nfts.reduce(
          (prev, cur) => [
            ...prev,
            ...cur.non_fungible_ids.items.map(({ non_fungible_id }) => ({
              address: cur.resource_address,
              id: non_fungible_id,
              name: cur.name
            }))
          ],
          [] as Array<{ address: string; id: string; name: string | undefined }>
        )
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
    },
    guards: {
      hasSelectedAccount: ({ selectedAccountAddress }) =>
        !!selectedAccountAddress
    }
  }
)
