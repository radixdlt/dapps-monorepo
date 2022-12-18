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
}

type Events =
  | { type: 'UPLOAD_FILES'; abi: File; wasm: File }
  | { type: 'REMOVE_FILE' }
  | { type: 'SELECT_ACCOUNT'; address: string }
  | { type: 'SELECT_BADGE'; index: number }
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
              | { 'deploying-package': 'deploy' | 'idle' }
          }
      context: Context
    }
  | {
      value: 'error'
      context: Context & {
        error: Error
      }
    }
  | {
      value: {
        connected: {
          'deploying-package': 'success'
        }
      }
      context: Context & {
        selectedNft: {
          name?: string
          address: string
          id: string
        }
        non_fungible_resources: Array<{
          address: string
          total_count: number
        }>
        intentHash: string
        badgeMetadata: Array<{
          key: string
          value: string
        }>
        packageAddress: string
        badgeName?: string
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
              selectedAccountAddress: (_, event) => event.address,
              selectedNft: (_, __) => undefined,
              non_fungible_resources: (_, __) => []
            })
          },
          SELECT_BADGE: {
            target: '.selecting-badge.selected',
            actions: assign({
              selectedNft: (ctx, event) =>
                ctx.non_fungible_resources[event.index]
            })
          },
          DEPLOY: {
            target: '.deploying-package.deploy',
            cond: (ctx) =>
              ctx.wasm &&
              ctx.abi &&
              ctx.selectedAccountAddress &&
              ctx.selectedNft
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
                      intentHash: (
                        _,
                        event: DoneInvokeEvent<{
                          txID: string
                          entities: string[]
                          badgeMetadata: Array<{ key: string; value: string }>
                        }>
                      ) => event.data.txID,
                      packageAddress: (
                        _,
                        event: DoneInvokeEvent<{
                          txID: string
                          entities: string[]
                          badgeMetadata: Array<{ key: string; value: string }>
                        }>
                      ) => event.data.entities[0],
                      badgeMetadata: (
                        _,
                        event: DoneInvokeEvent<{
                          txID: string
                          entities: string[]
                          badgeMetadata: Array<{ key: string; value: string }>
                        }>
                      ) => event.data.badgeMetadata
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
            ...(await queryServer('getNonFungibleIDs', {
              accountAddress: selectedAccountAddress!,
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

      deploy: (ctx) => {
        if (
          !ctx.wasm ||
          !ctx.abi ||
          !ctx.selectedAccountAddress ||
          !ctx.selectedNft
        ) {
          throw new Error('Unexpected state')
        }
        return mutateServer('sendTransaction', {
          transactionManifest: getDeployPackageManifest(
            ctx.wasm,
            ctx.abi,
            ctx.selectedAccountAddress,
            ctx.selectedNft.address
          ),
          blobs: [ctx.wasm, ctx.abi]
        })
          .then(async ({ transactionIntentHash }) => ({
            txID: transactionIntentHash,
            entities: (
              await queryServer('getTransactionDetails', transactionIntentHash)
            ).entities,
            badgeMetadata: (
              await queryServer('getEntityDetails', ctx.selectedNft?.address)
            ).metadata.items
          }))
          .then((result) => ({
            ...result,
            badgeName: result.badgeMetadata.find(({ key }) => key === 'name')
              ?.value,
            badgeMetadata: result.badgeMetadata.filter(
              ({ key }) => key !== 'name'
            )
          }))
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
