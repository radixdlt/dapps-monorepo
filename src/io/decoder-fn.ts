import { ZodError, ZodType } from 'zod'

type DecoderObject = Record<string, any>

type Decoders<T extends DecoderObject> = {
  [K in keyof T]: ZodType<T[K]>
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
