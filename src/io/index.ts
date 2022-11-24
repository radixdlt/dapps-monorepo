import { decoderFn } from './decoder-fn'
import * as walletapis from './wallet'
import * as gatewayapis from './gateway'

const all = { ...gatewayapis, ...walletapis }

export const decoders = decoderFn(all)
