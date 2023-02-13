import { DAPP_DEF_ADDRESS } from '@constants'
import type { Handle } from '@sveltejs/kit'

const json = {
  dApps: [
    {
      dAppDefinitionAddress: `${DAPP_DEF_ADDRESS}`
    }
  ]
}

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.endsWith('/.well-known/radix.json')) {
    return new Response(JSON.stringify(json), {
      headers: {
        'content-type': 'application/json'
      }
    })
  }

  const response = await resolve(event)
  return response
}
