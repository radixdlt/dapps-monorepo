import { Box, Typography } from '@mui/joy'
import { shortenAddress } from '../../helpers/shorten-address'

import { Clipboard } from '../../components/Clipboard'
export const GumballMachineInfoBox = ({
  label,
  address
}: {
  label: string
  address: string
}) => {
  return (
    <Box>
      <Typography level="h4">
        {label}
        <Clipboard textToCopy={address}></Clipboard>
      </Typography>
      <Typography>{shortenAddress(address)}</Typography>
    </Box>
  )
}
