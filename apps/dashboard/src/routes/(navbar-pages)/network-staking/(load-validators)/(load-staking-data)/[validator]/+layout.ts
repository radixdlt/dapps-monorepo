import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ params, parent }) => {
  const validator = parent().then((data) =>
    data.promises.validators.then((validators) => {
      const validator = validators.find(
        (validator) => validator.address === params.validator
      )!

      return validator
    })
  )

  return {
    promises: {
      validator
    },
    validatorAddress: params.validator
  }
}
