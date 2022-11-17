import { literal, object, string } from 'zod'
import { withFormattedErrors } from './with-formatted-errors'

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
    const parser = object({
      test2: object({ foo: string() }),
      test: literal('foo')
    })
    try {
      withFormattedErrors(parser, { test2: { foo: 22 }, test: 'bar' })
    } catch (error: any) {
      expect(error?.message).toEqual(str)
    }
  })
})
