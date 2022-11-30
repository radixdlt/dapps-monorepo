import { PUBLIC_NETWORK_NAME } from '$env/static/public'

export const load = () => ({
  network: process.env.PUBLIC_NETWORK_NAME || PUBLIC_NETWORK_NAME
})
