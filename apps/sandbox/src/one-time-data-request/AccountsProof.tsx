import Box from '@mui/joy/Box'
import Checkbox from '@mui/joy/Checkbox'
import { Card } from '../components/Card'
import { Button, Input } from '@mui/joy'

export const AccountsProofCard = ({
  state,
  updateState
}: {
  state: {
    enabled: boolean
    data: {
      addresses: string[]
    }
  }
  updateState: (state: {
    enabled: boolean
    data: {
      addresses: string[]
    }
  }) => void
}) => {
  const enabled = !!state.enabled
  return (
    <Card
      title="Accounts Proof of Ownership"
      side={
        <Checkbox
          checked={enabled}
          onChange={(ev) => {
            updateState({ ...state, enabled: ev.target.checked })
          }}
        />
      }
    >
      <Box
        sx={{
          p: 2,
          display: 'grid',
          gap: 2
        }}
      >
        <Button
          color="primary"
          onClick={() => {
            updateState({
              ...state,
              data: {
                addresses: [...state.data.addresses, '']
              }
            })
          }}
        >
          Add
        </Button>
        {state.data.addresses.map((address, index) => (
          <Box sx={{ display: 'flex', gap: 1 }} key={index}>
            <Input
              sx={{ width: '100%' }}
              placeholder="account address"
              value={address}
              onChange={(ev) => {
                const addresses = [...state.data.addresses]
                addresses[index] = ev.target.value
                updateState({
                  ...state,
                  data: {
                    addresses
                  }
                })
              }}
            />
            <Button
              onClick={() => {
                const addresses = [...state.data.addresses]
                addresses.splice(index, 1)
                updateState({
                  ...state,
                  data: {
                    addresses
                  }
                })
              }}
            >
              x
            </Button>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
