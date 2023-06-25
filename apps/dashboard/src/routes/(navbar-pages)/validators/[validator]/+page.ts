import type { Validator } from '@pages/navbar-pages/staking/Validators.svelte'
import { goto } from '$app/navigation'
import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = ({ params, parent }) => {
  const validator = parent().then(
    (data) =>
      data.promises.validators.then((validators) => {
        const validator = validators.find(
          (validator) => validator.address === params.validator
        )

        if (!validator) {
          goto('/validators')
        }

        return validator
      }) as Promise<Validator>
  )

  return {
    promises: {
      validator
    }
  }
}
