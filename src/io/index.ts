import { decoderFn } from './decoder-fn'
import * as walletapis from './wallet'
import * as gatewayapis from './gateway'

const all = { ...gatewayapis, ...walletapis }

// @ts-ignore // It complains because not every transformer is an object, it doesn't affect the typing though
export const decoders = decoderFn(all)
