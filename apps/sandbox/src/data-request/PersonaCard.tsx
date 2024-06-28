import Box from '@mui/joy/Box'
import Checkbox from '@mui/joy/Checkbox'
import { useDataRequestState } from '../rdt/hooks/useDataRequestState'
import { Card } from '../components/Card'
import { dataRequestStateModule } from '../rdt/rdt'
import { DataRequestBuilder } from '@common/rdt'

export const PersonaCard = () => {
  const dataRequestState = useDataRequestState()
  return (
    <Card title="Persona">
      <Box>
        <Checkbox
          label="With proof"
          size="sm"
          checked={!!dataRequestState.persona?.withProof}
          onChange={(ev) => {
            if (!ev.target.checked)
              dataRequestStateModule.removeState('persona')
            else
              dataRequestStateModule.patchState(
                DataRequestBuilder.persona().withProof(ev.target.checked)
              )
          }}
        />
      </Box>
    </Card>
  )
}
