import { bookmarkedValidatorsApi } from '../../../../server/validators/validators-api'
import type { LayoutLoad } from './$types'
import { getValidators } from '@api/utils/entities/validator'
import { bookmarkedValidatorsStore } from '../../../../stores'

export const prerender = false

export const _dependency = 'load:validators'

export type Bookmarked = { [validator: string]: boolean }

export const load: LayoutLoad = async ({ depends }) => {
  depends(_dependency)

  const bookmarkedValidators = bookmarkedValidatorsApi
    .getAll(fetch)
    .unwrapOr([] as string[])
    .then((bookmarked) =>
      bookmarked.reduce<Bookmarked>(
        (prev, curr) => ({ ...prev, [curr]: true }),
        {}
      )
    )
    .then((bookmarked) => {
      bookmarkedValidatorsStore.set(bookmarked)
      return bookmarked
    })

  const validators = getValidators()

  return {
    promises: {
      validators,
      bookmarkedValidators
    }
  }
}
