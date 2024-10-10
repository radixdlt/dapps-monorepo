import Box from '@mui/joy/Box'
import Checkbox from '@mui/joy/Checkbox'
import { Card } from '../components/Card'
import { Input } from '@mui/joy'

export const PersonaProofCard = ({
  state,
  updateState
}: {
  state: {
    enabled: boolean
    data: {
      address: string
    }
  }
  updateState: (state: {
    enabled: boolean
    data: {
      address: string
    }
  }) => void
}) => {
  const enabled = !!state.enabled
  return (
    <Card
      title="Persona Proof of Ownership"
      side={
        <Checkbox
          checked={enabled}
          onChange={(ev) => {
            updateState({ ...state, enabled: ev.target.checked })
          }}
        />
      }
    >
      <Box sx={{ p: 2 }}>
        <Input
          placeholder="Identity address"
          onChange={(event) => {
            updateState({
              ...state,
              data: { address: event.target.value.toString() }
            })
          }}
        />
      </Box>
    </Card>
  )
}
