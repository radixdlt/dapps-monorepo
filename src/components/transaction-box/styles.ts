import { css } from '@styles'

export const grid = css({
  display: 'grid',
  gridTemplateColumns: 'auto',
  gridAutoRows: '30px',
  gridTemplateAreas: `
        "key value"  
      `
})()

export const value = css({
  justifySelf: 'end'
})()
