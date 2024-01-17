import { useEffect, useState } from 'react'
import { useRdt } from './useRdt'
import { WalletData } from '@common/utils/rdt'

export const useRdtState = () => {
  const rdt = useRdt()
  const [state, setState] = useState<WalletData>()

  useEffect(() => {
    const subscription = rdt.walletApi.walletData$.subscribe((state) => {
      setState(state)
    })

    return () => {
      subscription.unsubscribe()
    }
  })

  return state
}
