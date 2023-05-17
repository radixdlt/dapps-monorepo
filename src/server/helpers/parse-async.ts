import { ResultAsync } from 'neverthrow'
import type { ZodObject, ZodRawShape, ZodError } from 'zod'

export type ParseAsync = typeof parseAsync
export const parseAsync = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  data: T
) =>
  ResultAsync.fromPromise(
    schema.parseAsync(data),
    (error: any): ZodError => error
  )
