import { ResultAsync } from 'neverthrow'
import type {
  ZodObject,
  ZodRawShape,
  ZodError,
  ZodAny,
  ZodTypeAny,
  z
} from 'zod'

export type ParseAsync = typeof parseAsync
export const parseAsync = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  data: T
) =>
  ResultAsync.fromPromise(
    schema.parseAsync(data),
    (error: any): ZodError => error
  )
