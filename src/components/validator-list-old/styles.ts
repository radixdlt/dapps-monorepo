import { css } from '@styles'

export const filterBtn = css({
  width: 'max-content',
  padding: '$sm $md',
  border: 'none',
  borderRadius: '$sm'
})()

export const header = css({
  alignSelf: 'center'
})()

export const validatorList = (selectedAccount: boolean) =>
  css({
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: `${
      selectedAccount ? '1fr 1fr' : ''
    } 200px 1fr 2.5fr 2fr 1fr 1.5fr 2fr 1fr`,
    rowGap: 15,
    columnGap: 10,
    '*': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  })()
