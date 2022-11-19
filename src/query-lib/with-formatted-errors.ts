import type { ZodObject, ZodRawShape } from 'zod'
import { ZodError } from 'zod'

export const withFormattedErrors =
  <R extends ZodRawShape>(query: ZodObject<R>) =>
  (input: unknown) => {
    try {
      return query.parse(input)
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(error.format(), null, 2))
      }
      throw error
    }
  }
