import Box from '@mui/joy/Box'
import Divider from '@mui/joy/Divider'
import Sheet from '@mui/joy/Sheet'
import Button from '@mui/joy/Button'
import Typography from '@mui/joy/Typography'
import { AccountsCard } from './AccountsCard'
import { PersonaDataCard } from './PersonaDataCard'
import { Code } from '../components/Code'
import { rdt } from '../rdt/rdt'
import {
  OneTimeDataRequestBuilder,
  OneTimeDataRequestBuilderItem
} from '@common/rdt'
import { useState } from 'react'
import { PersonaProofCard } from './PersonaProof'
import { AccountsProofCard } from './AccountsProof'
export const OneTimeDataRequestsPage = () => {
  const [state, setState] = useState<{
    accounts: {
      enabled: boolean
      data: {
        numberOfAccounts: {
          quantity: number
          quantifier: 'atLeast' | 'exactly'
        }
        withProof: boolean
      }
    }
    personaData: {
      enabled: boolean
      data: {
        fullName: boolean
        emailAddresses: boolean
        phoneNumbers: boolean
      }
    }
    personaProof: {
      enabled: boolean
      data: {
        address: string
      }
    }
    accountsProof: {
      enabled: boolean
      data: {
        addresses: string[]
      }
    }
  }>({
    accounts: {
      enabled: true,
      data: {
        numberOfAccounts: { quantity: 1, quantifier: 'atLeast' },
        withProof: false
      }
    },
    personaData: {
      enabled: false,
      data: {
        fullName: false,
        emailAddresses: false,
        phoneNumbers: false
      }
    },
    personaProof: {
      enabled: false,
      data: {
        address: ''
      }
    },
    accountsProof: {
      enabled: false,
      data: {
        addresses: []
      }
    }
  })

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns:
          'minmax(160px, 300px) minmax(300px, 500px) minmax(200px, 1fr)',
        gap: 1
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 1
        }}
      >
        <AccountsCard
          state={state.accounts}
          updateState={(accountsState) => {
            setState((prev) => ({ ...prev, accounts: accountsState }))
          }}
        />
        <PersonaDataCard
          state={state.personaData}
          updateState={(personaDataState) => {
            setState((prev) => ({ ...prev, personaData: personaDataState }))
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: 1
        }}
      >
        <PersonaProofCard
          state={state.personaProof}
          updateState={(personaProof) => {
            setState((prev) => ({ ...prev, personaProof }))
          }}
        />
        <AccountsProofCard
          state={state.accountsProof}
          updateState={(accountsProof) => {
            setState((prev) => ({ ...prev, accountsProof }))
          }}
        />
      </Box>
      <Box>
        <Sheet
          variant="outlined"
          sx={{
            borderRadius: 'sm',
            p: 2,
            mb: 2,
            height: '100%'
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ alignSelf: 'center' }} level="h4">
                One Time Data Request
              </Typography>
              <Button
                onClick={() => {
                  const dataRequest: OneTimeDataRequestBuilderItem[] = []
                  if (state.accounts.enabled) {
                    const accountsRequest = OneTimeDataRequestBuilder.accounts()
                    accountsRequest[
                      state.accounts.data.numberOfAccounts.quantifier
                    ](state.accounts.data.numberOfAccounts.quantity)
                    accountsRequest.withProof(state.accounts.data.withProof)

                    dataRequest.push(accountsRequest)
                  }

                  if (state.personaData.enabled) {
                    const personaDataRequest =
                      OneTimeDataRequestBuilder.personaData()

                    if (state.personaData.data.fullName) {
                      personaDataRequest.fullName()
                    }

                    if (state.personaData.data.emailAddresses) {
                      personaDataRequest.emailAddresses()
                    }

                    if (state.personaData.data.phoneNumbers) {
                      personaDataRequest.phoneNumbers()
                    }

                    dataRequest.push(personaDataRequest)
                  }

                  if (
                    state.personaProof.enabled ||
                    state.accountsProof.enabled
                  ) {
                    let poo = OneTimeDataRequestBuilder.proofOfOwnership()
                    if (
                      state.personaProof.enabled &&
                      state.accountsProof.enabled
                    ) {
                      dataRequest.push(
                        poo
                          .accounts(
                            state.accountsProof.data.addresses.filter(Boolean)
                          )
                          .identity(state.personaProof.data.address)
                      )
                    } else if (state.personaProof.enabled) {
                      dataRequest.push(
                        poo.identity(state.personaProof.data.address)
                      )
                    } else if (state.accountsProof.enabled) {
                      dataRequest.push(
                        poo.accounts(
                          state.accountsProof.data.addresses.filter(Boolean)
                        )
                      )
                    }
                  }

                  rdt.walletApi.sendOneTimeRequest(...dataRequest)
                }}
                sx={{ alignSelf: 'center', width: '150px' }}
              >
                Send request
              </Button>
            </Box>

            <Divider sx={{ mb: 2, mt: 2 }} />

            <Code code={JSON.stringify(state, null, 2)}></Code>
          </Box>
        </Sheet>
      </Box>
    </Box>
  )
}
