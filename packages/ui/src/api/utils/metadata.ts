import type {
  EntityMetadataCollection,
  EntityMetadataItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { pipe } from 'ramda'

type FinalReturnType<T> = {
  0: T
  1: T extends (...args: any) => infer R ? FinalReturnType<R> : T
}[T extends (...args: any) => infer _ ? 1 : 0]

export const getMetadataItem =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    metadata?.items.find((item) => item.key === key)

export const getEnumStringMetadata =
  (key: string) =>
  (metadata?: EntityMetadataCollection): string =>
    pipe(
      () => getMetadataItem(key)(metadata),
      (item) => (item?.value?.programmatic_json as any)?.fields?.[0].value || ''
    )()

export const getStringMetadata =
  (key: string) =>
  (metadata?: EntityMetadataCollection): string =>
    pipe(
      () => getMetadataItem(key)(metadata),
      (item) => (item?.value?.typed as any)?.value || ''
    )()

export const getVectorMetadata =
  (key: string) =>
  (metadata?: EntityMetadataCollection): any[] =>
    pipe(
      () => getMetadataItem(key)(metadata),
      (item) => (item?.value.typed as any)?.values || []
    )()

export const getStandardMetadataEntry =
  <
    T extends
      | typeof getEnumStringMetadata
      | typeof getStringMetadata
      | typeof getVectorMetadata
  >(
    key: string,
    getMetadataFn: T
  ) =>
  (
    metadata?: EntityMetadataCollection
  ):
    | {
        item: EntityMetadataItem
        value: FinalReturnType<T>
      }
    | undefined => {
    const item = getMetadataItem(key)(metadata)

    if (item)
      return {
        item,
        value: getMetadataFn(key)(metadata) as FinalReturnType<T>
      }
  }
