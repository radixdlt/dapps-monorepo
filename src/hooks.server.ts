import { PUBLIC_NETWORK_NAME } from '$env/static/public'
import { Network } from '@constants'
import type { Handle } from '@sveltejs/kit'

const ADDRESS = {
  [Network.NEBUNET]:
    'account_tdx_b_1qlcxt0fvwujp6rnatd7qysufw744vmeyr0j0v7me5y7swl5epu',
  [Network.HAMMUNET]:
    'account_tdx_22_1pryua594ne5wcjcyvefa87qrzuw9vs76s9pfpn7ldhjsl3r82l'
}[PUBLIC_NETWORK_NAME]

const json = {
  dApps: [
    {
      dAppDefinitionAddress: `${ADDRESS}`
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
