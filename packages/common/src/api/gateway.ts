import { fromPromise, okAsync, type ResultAsync } from 'neverthrow'
import { CURRENT_NETWORK } from '../../src/network'
import { GatewayApiClient, type ErrorResponse } from '@common/utils/gateway-sdk'
import { cache } from './cache'

const gatewayApi = GatewayApiClient.initialize({
  applicationName: 'Radix Dashboard',
  basePath: CURRENT_NETWORK?.url
})

type RawGatewayError = {
  errorResponse: ErrorResponse
}

const isGatewayError = (error: any): error is RawGatewayError =>
  error.hasOwnProperty('errorResponse')

const handleError = (error: unknown): ErrorResponse => {
  if (isGatewayError(error)) {
    return error.errorResponse
  } else {
    return {
      message: 'Unknown network error.'
    }
  }
}

type MethodsOf<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never
}

function extractMethods<T>(instance: T): MethodsOf<T> {
  const methodNames = Object.getOwnPropertyNames(
    Object.getPrototypeOf(instance)
  )
  const methods: Partial<MethodsOf<T>> = {}

  for (const methodName of methodNames) {
    const method = (instance as any)[methodName]
    if (typeof method === 'function') {
      methods[methodName as keyof T] = method.bind(instance)
    }
  }

  return methods as MethodsOf<T>
}

export const api = {
  ...extractMethods(gatewayApi.state),
  ...extractMethods(gatewayApi.stream),
  ...extractMethods(gatewayApi.status),
  ...extractMethods(gatewayApi.transaction),
  ...extractMethods(gatewayApi.statistics)
}

export const callApiWithCache = <T extends keyof typeof api>(
  ...[methodName, ...args]: Parameters<typeof callApi<T>>
): ReturnType<typeof callApi<T>> => {
  const _cache = cache[methodName]

  if (_cache && _cache.has(args)) return okAsync(_cache.get(args))

  return callApi(methodName, ...args)
}

export const callApi = <T extends keyof typeof api>(
  methodName: T,
  ...args: Parameters<(typeof api)[T]>
) =>
  (
    fromPromise((api[methodName] as any)(...args), handleError) as ResultAsync<
      Awaited<ReturnType<(typeof api)[T]>>,
      ReturnType<typeof handleError>
    >
  ).map((res) => {
    const _cache = cache[methodName]
    if (_cache) _cache.set(args, res)
    return res
  })
