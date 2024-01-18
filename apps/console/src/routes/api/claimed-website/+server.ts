import { error, json } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

export const POST = async ({ request }: RequestEvent) => {
  const { url, expectedAddress } = await request.json()

  try {
    const output = await fetch(`${url}/.well-known/radix.json`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data?.dApps)) {
          return data.dApps.find(
            (dApp: any) => dApp?.dAppDefinitionAddress === expectedAddress
          )
            ? 'verified'
            : 'notVerified'
        }

        return 'notVerified'
      })

    return json(
      {
        output
      },
      {
        status: 200
      }
    )
  } catch (e) {
    return json(
      {
        output: 'error'
      },
      {
        status: 200
      }
    )
  }
}
