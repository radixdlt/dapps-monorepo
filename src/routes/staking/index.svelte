<script lang="ts">
  import { box, css } from "@styles"
  import type { Validators } from "@types"

  export let validators: Validators

  const frame = box({
    css: {
      display: 'flex',
      flexDirection: 'column'
    }
  })

  const validatorBox = css({
    display: "grid",
    grid: `
      searchByName ads stakePrc ownerStake fee uptime searchByAddress .
      
    `
  })
</script>

<div class={frame}>
  {#each validators.validators as validator}
    <div class={validatorBox()}>
      {validator.properties.name}
    </div>
  {/each}
</div>
