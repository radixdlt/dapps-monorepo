import { assign, createMachine, type DoneInvokeEvent } from 'xstate'
import type { EntityOverview } from '@io/gateway'
import { queryServer } from '@queries'
import type {
  EntityOverviewTransformed,
  EntityResourcesTransformed
} from '@queries/transformations'
import {
  transformNFTWithOverview,
  transformWithOverview,
  type TransformWithOverview
} from './transformers'
import { escalate, pure } from 'xstate/lib/actions'

type Context = {
  resources?: EntityResourcesTransformed
  overview?: {
    fungible: EntityOverviewTransformed
    nonFungible: Array<
      EntityOverviewTransformed['withOverviews'][0] & {
        non_fungible_ids: {
          items: Array<{
            non_fungible_id: string
          }>
        }
      }
    >
  }
  transformedOverview?: {
    fungible: TransformWithOverview
    nonFungible: TransformWithOverview
  }
  error?: Error
  isChild?: boolean
  accountAddress?: string
}

type Events =
  | { type: 'LOAD'; address: string; isChild?: boolean }
  | { type: 'RETRY' }

type States =
  | {
      value: 'fetched-resources'
      context: Context & {
        resources: EntityResourcesTransformed
        overview: undefined
      }
    }
  | {
      value: 'fetching-resources'
      context: Context & {
        resources: undefined
        overview: undefined
      }
    }
  | {
      value: 'fetching-overview'
      context: Context & {
        resources: EntityResourcesTransformed
        overview: undefined
      }
    }
  | {
      value: 'fetched-overview'
      context: Context & {
        resources: EntityResourcesTransformed
        overview: EntityOverview
      }
    }
  | {
      value: 'final'
      context: Context & {
        resources: EntityResourcesTransformed
        overview: EntityOverview
        transformedOverview: {
          fungible: EntityOverviewTransformed
          nonFungible: EntityOverviewTransformed
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
    id: 'account',
    initial: 'idle',
    predictableActionArguments: true,
    context: {
      overview: undefined,
      resources: undefined,
      isChild: false,
      accountAddress: undefined
    },
    states: {
      idle: {
        on: {
          LOAD: {
            target: 'fetching-resources',
            actions: assign({
              isChild: (_, event) => event?.isChild
            })
          }
        }
      },
      'fetching-resources': {
        invoke: {
          id: 'fetching-resources',
          src: 'fetchingResources',
          onDone: {
            target: 'fetched-resources',
            actions: assign({
              resources: (_, event) => event.data.resources,
              accountAddress: (_, event) => event.data.address
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
      'fetched-resources': {
        invoke: {
          id: 'fetching-overview',
          src: 'fetchingOverview',
          onDone: {
            target: 'fetched-overview',
            actions: assign({
              overview: (
                _,
                event: DoneInvokeEvent<{
                  fungible: EntityOverviewTransformed
                  nonFungible: Array<
                    EntityOverviewTransformed['withOverviews'][0] & {
                      non_fungible_ids: {
                        items: Array<{
                          non_fungible_id: string
                        }>
                      }
                    }
                  >
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
        }
      },
      'fetched-overview': {
        invoke: {
          id: 'fetched-overview',
          src: 'transformOverview',
          onDone: {
            target: 'idle',
            actions: assign({
              transformedOverview: (
                _,
                event: DoneInvokeEvent<{
                  fungible: TransformWithOverview
                  nonFungible: TransformWithOverview
                }>
              ) => {
                return event.data
              }
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
      error: {
        on: { LOAD: { target: 'fetching-resources' } },
        entry: pure((ctx: Context, event) => {
          // if statemachine is a child, escalate the error. typing is a bit weird here
          // @ts-ignore
          if (ctx.isChild) return escalate(event.data)
        })
      }
    }
  },
  {
    services: {
      transformOverview: async (ctx) => {
        const transformedOverviewsFungible = transformWithOverview(
          ctx.overview?.fungible.withOverviews
        )
        const transformedOverviewsNonFungible = transformNFTWithOverview(
          ctx.overview?.nonFungible
        )
        return {
          nonFungible: transformedOverviewsNonFungible,
          fungible: transformedOverviewsFungible
        }
      },
      fetchingOverview: async ({ resources, accountAddress }) => {
        if (!resources || !accountAddress) {
          throw new Error('Unexpected state')
        }

        const isNonEmpty = <T>(item?: T[]) => item && item.length > 0

        const fungible = isNonEmpty(resources.fungible)
          ? await queryServer('getEntityOverview', resources.fungible)
          : []

        const nonFungible = isNonEmpty(resources.nonFungible)
          ? await Promise.all(
              (
                await queryServer('getEntityOverview', resources.nonFungible)
              ).withOverviews.map(async (nft) => ({
                ...(await queryServer('getEntityNonFungibleIDs', {
                  accountAddress,
                  nftAddress: nft.address
                })),
                ...nft
              }))
            )
          : []

        return { fungible, nonFungible }
      },
      fetchingResources: async (_, event) => {
        if (event.type !== 'LOAD') {
          throw new Error('Unexpected event')
        }
        return {
          resources: await queryServer('getEntityResources', event.address),
          address: event.address
        }
      }
    }
  }
)
