import { ZodError, ZodObject, type ZodRawShape } from 'zod'

type DecoderObject = Record<string, any>

type Decoders<T extends DecoderObject> = {
  [K in keyof T]: T[K] extends ZodRawShape ? ZodObject<T[K]> : never
}

export const decoderFn =
  <T extends DecoderObject>(alldecoders: Decoders<T>) =>
  <K extends keyof T>(io: K, value: unknown) => {
    try {
      return alldecoders[io].parse(value)
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(error.format(), null, 2))
      }
      throw error
    }
  }
