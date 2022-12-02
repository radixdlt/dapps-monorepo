import { assign, createMachine, type DoneInvokeEvent } from 'xstate'
import type { EntityOverview } from '@io/gateway'
import { queryServer } from '@queries'
import type {
  EntityOverviewTransformed,
  EntityResourcesTransformed
} from '@queries/transformations'
import {
  transformWithOverview,
  type TransformWithOverview
} from './transformers'

type Context = {
  resources?: EntityResourcesTransformed
  overview?: {
    fungible: EntityOverviewTransformed
    nonFungible: EntityOverviewTransformed
  }
  transformedOverview?: {
    fungible: TransformWithOverview
    nonFungible: TransformWithOverview
  }
  error?: Error
}

type Events = { type: 'LOAD'; address: string } | { type: 'RETRY' }

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
      resources: undefined
    },
    states: {
      idle: {
        on: { LOAD: { target: 'fetching-resources' } }
      },
      'fetching-resources': {
        invoke: {
          id: 'fetching-resources',
          src: 'fetchingResources',
          onDone: {
            target: 'fetched-resources',
            actions: assign({
              resources: (
                _,
                event: DoneInvokeEvent<EntityResourcesTransformed>
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
                  nonFungible: EntityOverviewTransformed
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
            target: 'final',
            actions: assign({
              transformedOverview: (
                _,
                event: DoneInvokeEvent<{
                  fungible: TransformWithOverview
                  nonFungible: TransformWithOverview
                }>
              ) => {
                console.log(event.data)
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
      final: {},
      error: {
        on: { RETRY: { target: 'fetching-resources' } }
      }
    }
  },
  {
    services: {
      transformOverview: async (ctx) => {
        const transformedOverviewsFungible = transformWithOverview(
          ctx.overview?.fungible.withOverviews
        )
        const transformedOverviewsNonFungible = transformWithOverview(
          ctx.overview?.nonFungible.withOverviews
        )
        return {
          nonFungible: transformedOverviewsNonFungible,
          fungible: transformedOverviewsFungible
        }
      },
      fetchingOverview: async (ctx) => {
        if (!ctx.resources) {
          throw new Error('Unexpected state')
        }
        const fungible = await queryServer(
          'getEntityOverview',
          ctx.resources.fungible?.slice(0, 10)
        )
        const nonFungible = await queryServer(
          'getEntityOverview',
          ctx.resources.nonFungible?.slice(0, 10)
        )
        return { fungible, nonFungible }
      },
      fetchingResources: async (_, event) => {
        if (event.type !== 'LOAD') {
          throw new Error('Unexpected event')
        }
        return queryServer('getEntityResources', event.address)
      }
    }
  }
)
