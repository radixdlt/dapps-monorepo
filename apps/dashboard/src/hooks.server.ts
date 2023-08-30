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
  if (event.url.pathname.includes('/api')) {
    return new Response(JSON.stringify({}), {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  console.log('REQUEST URL:', event.url.pathname)
  console.log('REQUEST:', event.request)

  if (event.url.pathname.endsWith('/.well-known/radix.json')) {
    return new Response(JSON.stringify(json), {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  let response

  try {
    response = await resolve(event)
  } catch (e) {
    console.error('ERROR:', e)
    throw e
  }

  response.headers.set('Cache-Control', 'no-cache')

  console.log('RESPONSE:', response)

  return response
}
