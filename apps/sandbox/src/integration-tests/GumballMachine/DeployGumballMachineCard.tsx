// @ts-ignore
import gumballWasmUrl from '../../assets/gumball_machine.wasm?url'
// @ts-ignore
import gumballSchemaUrl from '../../assets/gumball_machine.rpd?url'

import Button from '@mui/joy/Button'
import { useRdt } from '../../rdt/hooks/useRdt'
import { Card } from '../../components/Card'
import { useLogger } from '../../components/Logger'
import { ResultAsync } from 'neverthrow'
import { loadBinaryFromUrl } from '../../helpers/load-binary-from-url'
import { getDeployPackageManifest } from '../../manifests/deploy-package'
import { setGumballMachineState, useGumballMachineState } from '../state'
import Alert from '@mui/joy/Alert'
import { InstantiateGumballMachineCard } from './InstantiateGumballMachineCard'
import { SelectAccount } from '../../account/SelectAccount'
import { Box } from '@mui/joy'
import { SelectNftCollection } from '../../account/SelectNftCollection'
import { SelectNft } from '../../account/SelectNft'
import { sborDecode } from '../../ret/decode-sbor'
import { gatewayApi } from '../../rdt/rdt'
import { useState } from 'react'
const loadGumballMachineBinaries = () =>
  ResultAsync.combine([
    loadBinaryFromUrl(gumballWasmUrl),
    loadBinaryFromUrl(gumballSchemaUrl).andThen((schema) => sborDecode(schema))
  ])

export const DeployGumballMachineCard = () => {
  const rdt = useRdt()
  const { gumballMachinePackageAddress } = useGumballMachineState()
  const { Logger, addLog, reset } = useLogger()

  const [state, setState] = useState<{
    ownerAccountAddress?: string
    ownerBadgeAddress?: string
    loading: boolean
    account?: string
    nftAddress?: string
    nftCollectionAddress?: string
  }>({ loading: false })

  const exec = () => {
    setState((prev) => ({ ...prev, loading: true }))
    return loadGumballMachineBinaries()
      .andThen(([wasm, rpd]) => {
        const transactionManifest = getDeployPackageManifest({
          account: state.ownerAccountAddress!,
          nftAddress: state.nftAddress!,
          wasm,
          rpd
        })
        console.log(transactionManifest)
        addLog('deploying gumball machine package...')
        return rdt.walletApi.sendTransaction({
          transactionManifest,
          blobs: [wasm],
          version: 1
        })
      })
      .andThen(({ transactionIntentHash }) =>
        gatewayApi
          .getTransactionDetails(transactionIntentHash)
          .map(
            (response): string =>
              (response.transaction.receipt?.state_updates as any)
                ?.new_global_entities?.[0]?.entity_address as string
          )
      )
      .map((packageAddress) => {
        addLog(`gumball machine packageAddress ${packageAddress}`)
        setGumballMachineState({
          gumballMachinePackageAddress: packageAddress,
          components: {}
        })
        setState((prev) => ({ ...prev, loading: false }))
        return packageAddress
      })
      .mapErr((err) => {
        setState((prev) => ({ ...prev, loading: false }))
        addLog(JSON.stringify(err, null, 2))
      })
  }

  return (
    <Card
      title="Deploy Gumball Machine"
      side={
        <Button
          variant="outlined"
          onClick={() => {
            setGumballMachineState({
              gumballMachinePackageAddress: '',
              components: {}
            })
            reset()
          }}
        >
          Reset
        </Button>
      }
    >
      {gumballMachinePackageAddress && (
        <Alert sx={{ mb: 1 }}>{gumballMachinePackageAddress}</Alert>
      )}

      {gumballMachinePackageAddress ? (
        <InstantiateGumballMachineCard />
      ) : (
        <Box>
          <SelectAccount
            placeholder="Select owner account..."
            sx={{ mb: 1 }}
            onChange={(ownerAccountAddress) => {
              setState((prev) => ({ ...prev, ownerAccountAddress }))
            }}
            value={state.account}
          />
          {state.ownerAccountAddress ? (
            <SelectNftCollection
              account={state.ownerAccountAddress}
              sx={{ mb: 1 }}
              onChange={(nftCollectionAddress) => {
                setState((prev) => ({ ...prev, nftCollectionAddress }))
              }}
            />
          ) : null}
          {state.nftCollectionAddress ? (
            <SelectNft
              accountAddress={state.ownerAccountAddress!}
              nftCollectionAddress={state.nftCollectionAddress}
              sx={{ mb: 1 }}
              onChange={(nftAddress) => {
                setState((prev) => ({ ...prev, nftAddress }))
              }}
            />
          ) : null}
          <Button
            fullWidth
            onClick={exec}
            disabled={state.loading || !state.nftAddress}
          >
            {state.loading ? 'Deploying...' : 'Deploy Gumball Machine'}
          </Button>
        </Box>
      )}

      {Logger && <Box sx={{ mt: 2 }}>{Logger}</Box>}
    </Card>
  )
}
