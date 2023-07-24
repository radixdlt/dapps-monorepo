import type { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit'
import { andThen, pipe } from 'ramda'

type RDT = ReturnType<typeof RadixDappToolkit>

export let resolveRDT: (rdt: RDT) => void

export const rdt = new Promise<RDT>((resolve) => (resolveRDT = resolve))

export const sendTransaction = (
  input: Parameters<RDT['walletApi']['sendTransaction']>[0]
) =>
  pipe(
    () => rdt,
    andThen((rdt) => rdt.walletApi.sendTransaction(input))
  )()
