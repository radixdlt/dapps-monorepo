import { assign, createMachine, type DoneInvokeEvent } from 'xstate'
import { mutateServer, queryServer } from '@queries'
import { hash } from '@utils'

type badgeType = {
  name?: string
  address: string
  id: string
}

export type DeployPayload = {
  wasm: string
  abi: string
  account: string
  badge: badgeType
}

const getDeployPackageManifest = (
  wasm: string,
  abi: string,
  account: string,
  badge: badgeType
) => {
  const codeHash: string = hash(wasm).toString('hex')
  const abiHash: string = hash(abi).toString('hex')
  return `
      PUBLISH_PACKAGE_WITH_OWNER 
        Blob("${codeHash}") 
        Blob("${abiHash}")
        NonFungibleAddress("${badge}", 1u32);

      CALL_METHOD 
        ComponentAddress("${account}") 
        "deposit_batch" 
        Expression("ENTIRE_WORKTOP");
      `
}

type Context = {
  error?: Error
  intentHash?: string
  badgeMetadata?: Array<{
    key: string
    value: string
  }>
  packageAddress?: string
}

type Events =
  | {
      type: 'DEPLOY'
      payload: DeployPayload
    }
  | { type: 'RETRY' }
  | { type: 'CONNECT' }

type States =
  | {
      value: 'connect.idle' | 'connect.success'
      context: Context
    }
  | {
      value: 'error'
      context: Context & {
        error: Error
      }
    }
  | { value: 'deploy.idle'; context: Context }
  | { value: 'deploy.pending'; context: Context }
  | {
      value: 'uploaded' | 'deploy.success'
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
    predictableActionArguments: true,
    context: {
      error: undefined,
      intentHash: undefined,
      packageAddress: undefined,
      badgeMetadata: undefined
    },
    type: 'parallel',
    states: {
      connect: {
        initial: 'idle',
        states: {
          idle: {},
          success: {
            type: 'final'
          }
        }
      },
      deploy: {
        initial: 'idle',
        states: {
          idle: {},
          pending: {
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
          success: {
            type: 'final'
          }
        },
        onDone: 'uploaded'
      },
      uploaded: {},
      error: {}
    },
    on: {
      CONNECT: { target: 'connect.success' },
      DEPLOY: {
        target: 'deploy.pending',
        cond: (_, event) =>
          !!event.payload.account &&
          !!event.payload.abi &&
          !!event.payload.badge &&
          !!event.payload.wasm
      }
    }
  },
  {
    services: {
      deploy: (_, e) => {
        if (e.type !== 'DEPLOY') {
          throw new Error('Unexpected state')
        }
        return mutateServer('sendTransaction', {
          transactionManifest: getDeployPackageManifest(
            e.payload.abi,
            e.payload.wasm,
            e.payload.account,
            e.payload.badge
          ),
          blobs: [e.payload.wasm, e.payload.abi]
        })
          .then(async ({ transactionIntentHash }) => ({
            txID: transactionIntentHash,
            entities: (
              await queryServer('getTransactionDetails', transactionIntentHash)
            ).entities,
            badgeMetadata: (
              await queryServer('getEntityDetails', e.payload.badge?.address)
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
      }
    }
  }
)
