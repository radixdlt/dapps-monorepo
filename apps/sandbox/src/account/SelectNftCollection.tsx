import { Select, Option } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { useEntities } from '../entity/state'

export const SelectNftCollection = ({
  placeholder = 'Select NFT Collection…',
  sx = {},
  onChange,
  account
}: {
  placeholder?: string
  sx?: SxProps
  onChange: (account: string) => void
  account: string
}) => {
  const entity = useEntities()

  const nftCollections = entity.account?.[account]?.nftCollections || []

  return (
    <Select
      placeholder={placeholder}
      sx={sx}
      onChange={(_, value) => {
        onChange(value as string)
      }}
    >
      {nftCollections.map((item) => (
        <Option key={item.address} value={item.address}>
          {item.address}
        </Option>
      ))}
    </Select>
  )
}
