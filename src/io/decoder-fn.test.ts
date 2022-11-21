import { literal, object, string } from 'zod'
import { decoderFn } from './decoder-fn'

const str = `{
  "_errors": [],
  "test2": {
    "_errors": [],
    "foo": {
      "_errors": [
        "Expected string, received number"
      ]
    }
  },
  "test": {
    "_errors": [
      "Invalid literal value, expected \\"foo\\""
    ]
  }
}`

describe('#with formatted errors', () => {
  it('Should return formatted zod error', () => {
    const parser = {
      demoparser: object({
        test2: object({ foo: string() }),
        test: literal('foo')
      })
    }
    try {
      decoderFn(parser)('demoparser', { test2: { foo: 22 }, test: 'bar' })
    } catch (error: any) {
      expect(error?.message).toEqual(str)
    }
  })
})
