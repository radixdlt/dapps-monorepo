import Box from '@mui/joy/Box'
import Checkbox from '@mui/joy/Checkbox'
import { useDataRequestState } from '../rdt/hooks/useDataRequestState'
import { Card } from '../components/Card'
import { dataRequestStateModule } from '../rdt/rdt'
import { DataRequestBuilder } from '@common/rdt'

export const PersonaDataCard = () => {
  const dataRequestState = useDataRequestState()
  const enabled = !!dataRequestState.personaData
  return (
    <Card
      title="Persona data"
      side={
        <Checkbox
          checked={enabled}
          onChange={(ev) => {
            if (!ev.target.checked)
              dataRequestStateModule.removeState('personaData')
            else
              dataRequestStateModule.patchState(
                DataRequestBuilder.personaData()
              )
          }}
        />
      }
    >
      <Box sx={{ p: 2 }}>
        {Object.values(['fullName', 'emailAddresses', 'phoneNumbers']).map(
          (field) => {
            let isChecked = false

            if (field === 'fullName') {
              isChecked = !!dataRequestState?.personaData?.fullName
            }

            if (field === 'emailAddresses') {
              isChecked =
                (dataRequestState?.personaData?.emailAddresses?.quantity || 0) >
                0
            }

            if (field === 'phoneNumbers') {
              isChecked =
                (dataRequestState?.personaData?.phoneNumbers?.quantity || 0) > 0
            }

            return (
              <Box key={field}>
                <Checkbox
                  label={field}
                  size="sm"
                  disabled={!enabled}
                  checked={isChecked}
                  onChange={(ev) => {
                    const updated = DataRequestBuilder.personaData({
                      ...dataRequestState.personaData!
                    })

                    if (field === 'fullName') {
                      updated.fullName(ev.target.checked)
                    }

                    if (field === 'emailAddresses') {
                      updated.emailAddresses(ev.target.checked)
                    }

                    if (field === 'phoneNumbers') {
                      updated.phoneNumbers(ev.target.checked)
                    }

                    dataRequestStateModule.patchState(updated)
                  }}
                />
              </Box>
            )
          }
        )}
        <Box mt={2}>
          <Checkbox
            disabled={!enabled}
            label="Reset"
            size="sm"
            checked={!!dataRequestState.personaData?.reset}
            onChange={(ev) => {
              dataRequestStateModule.patchState(
                DataRequestBuilder.personaData({
                  ...dataRequestState.personaData!,
                  reset: ev.target.checked
                })
              )
            }}
          />
        </Box>
      </Box>
    </Card>
  )
}
