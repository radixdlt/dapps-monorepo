import type { Validator } from '@dashboard-pages/navbar-pages/staking/Validators.svelte'
import { goto } from '$app/navigation'
import type { LayoutLoad } from './$types'

export const prerender = false

export const load: LayoutLoad = ({ params, parent }) => {
  const validator = parent().then(
    (data) =>
      data.promises.validators.then((validators) => {
        const validator = validators.find(
          (validator) => validator.address === params.validator
        )

        if (!validator) {
          goto('/not-found')
        }

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