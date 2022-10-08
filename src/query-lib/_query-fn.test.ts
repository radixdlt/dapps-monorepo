import { identity } from 'ramda'
import { _queryFn } from './_query-fn'

describe('#queryfn', () => {
  const queries = {
    request: {
      fn: vi.fn(),
      decoder: identity,
      transformationFn: vi.fn()
    },

    request2: {
      fn: (res: any) => res,
      decoder: identity,
      transformationFn: identity
    }
  }

  const queryFn = _queryFn(queries)
  it('Should return response ', async () => {
    queries.request.fn.mockResolvedValueOnce('request response')
    queries.request.transformationFn.mockImplementationOnce(identity)

    const query = await queryFn('request')
    expect(query).toEqual('request response')
  })

  it('Should return response modified response', async () => {
    queries.request.transformationFn.mockResolvedValueOnce(
      'request response modified'
    )
    const query = await queryFn('request')
    expect(query).toEqual('request response modified')
  })

  it('Should return param sent into queryFn', async () => {
    const query = await queryFn('request2', 'param')
    expect(query).toEqual('param')
  })
})
