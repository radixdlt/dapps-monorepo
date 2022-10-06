<script lang="ts">
  import { css } from '@styles'

  const stakePercentage = $$props.row.original.stakePercentage
  const stakeAccepted = $$props.getValue()

  const aligntd = css({
    float: 'right'
  })

  const stakePercentageStyle = css({
    color: '$muted',
    fontSize: '$sm'
  })
</script>

<span class={aligntd()}>
  <span>
    {stakeAccepted}
  </span>
  <span class={stakePercentageStyle()}>
    ({stakePercentage}%)
  </span>
</span>
