import { gatewayApi } from '../rdt/rdt'
import { useEffect, useState } from 'react'

export const useAccount = (accountAddress: string) => {
  const [state, setState] = useState<any>()

  useEffect(() => {
    gatewayApi
      .getEntityDetails(accountAddress)
      .map((accounts) => setState(accounts))
      .mapErr(() => setState(undefined))
  }, [accountAddress])

  return state
}
