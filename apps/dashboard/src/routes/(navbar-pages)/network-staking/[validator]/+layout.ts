import type { Validator } from '@api/utils/validators'
import type { LayoutLoad } from './$types'

export const prerender = false

export const load: LayoutLoad = ({ params, parent }) => {
  const validator = parent().then(
    (data) =>
      data.promises.validators.then((validators) => {
        const validator = validators.find(
          (validator) => validator.address === params.validator
        )

        return validator
      }) as Promise<Validator>
  )

  return {
    promises: {
      validator
    },
    validatorAddress: params.validator
  }
}
