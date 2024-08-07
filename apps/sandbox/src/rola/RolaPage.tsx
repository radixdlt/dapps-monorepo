import { Box, Button } from '@mui/joy'
import { Card } from '../components/Card'
import { useRdt } from '../rdt/hooks/useRdt'
import { useLogger } from '../components/Logger'
import { Code } from '../components/Code'

import { useDAppDefinitionAddress } from '../rdt/rdt'
import { useNetworkId } from '../network/state'
import { DataRequestBuilder } from '@common/rdt'
import { Rola, RolaError } from '@common/rola'
import { useState } from 'react'
export const RolaPage = () => {
  const dAppDefinitionAddress = useDAppDefinitionAddress()
  const origin = window.location.origin
  const defaults = {
    loading: false,
    verified: false
  }
  const [{ loading, verified, signedChallenge }, setState] =
    useState<any>(defaults)
  const rdt = useRdt()
  const networkId = useNetworkId()
  const { Logger, addLog } = useLogger()
  const { verifySignedChallenge } = Rola({
    applicationName: 'dApp Sandbox',
    expectedOrigin: origin,
    dAppDefinitionAddress,
    networkId
  })

  return (
    <Box>
      <Card title="ROLA (Radix Off-Ledger Authentication)">
        <Box>
          <Button
            disabled={loading}
            onClick={() => {
              setState(() => ({ ...defaults, loading: true }))
              addLog('Sending login request with challenge...')
              rdt.walletApi.setRequestData(
                DataRequestBuilder.persona().withProof()
              )
              rdt.walletApi
                .sendRequest()
                .andThen((response) => {
                  addLog('Got challenge response')
                  const signedChallenge = response.proofs![0]
                  setState((prev: any) => ({
                    ...prev,
                    signedChallenge,
                    loading: false
                  }))

                  return verifySignedChallenge(response.proofs![0])
                })
                .map(() => {
                  setState((prev: any) => ({
                    ...prev,
                    verified: true
                  }))
                })
                .mapErr((error) => {
                  addLog(`ROLA error: ${(error as any).reason}`)
                  setState((prev: any) => ({
                    ...prev,
                    loading: false,
                    verified: false
                  }))
                })
            }}
          >
            Send login request
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            disabled={loading}
            onClick={() => {
              setState(() => ({ ...defaults, loading: true }))
              addLog('Sending account request with challenge...')
              rdt.walletApi
                .sendOneTimeRequest(DataRequestBuilder.accounts().withProof())
                .andThen((response) => {
                  addLog('Got challenge response')
                  const signedChallenge = response.proofs![0]
                  setState((prev: any) => ({
                    ...prev,
                    signedChallenge,
                    loading: false
                  }))

                  return verifySignedChallenge(signedChallenge)
                })
                .map(() => {
                  setState((prev: any) => ({
                    ...prev,
                    verified: true
                  }))
                })
                .mapErr((error) => {
                  addLog(
                    `ROLA error: ${(error as unknown as RolaError).reason}`
                  )
                  setState((prev: any) => ({
                    ...prev,
                    loading: false,
                    verified: false
                  }))
                })
            }}
          >
            Verify accounts
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Code
            code={JSON.stringify(
              {
                signedChallenge,
                dAppDefinitionAddress,
                origin,
                verified
              },
              null,
              2
            )}
          ></Code>
        </Box>
        {Logger}
      </Card>
    </Box>
  )
}
