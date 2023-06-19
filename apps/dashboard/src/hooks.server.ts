import type { Handle } from '@sveltejs/kit'
import { CURRENT_NETWORK } from '@networks'

const json = {
  dApps: [
    {
      dAppDefinitionAddress: CURRENT_NETWORK.dappDefAddress
    }
  ]
}

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.endsWith('/.well-known/radix.json')) {
    return new Response(JSON.stringify(json), {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  const response = await resolve(event)

  response.headers.set('Cache-Control', 'no-cache')

  return response
}
