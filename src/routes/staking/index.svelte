<script lang="ts" context="module">
    import type { Load } from './__types'
    import { Gateway } from 'radix-js'
    import { MAINNET_URL } from '@constants'
  
    export const prerender = false
  
    export const load: Load = async () => {
      const response = await Gateway.validators(MAINNET_URL)
      return {
        props: { validators: await response.json() }
      }
    }
  </script>
  
  <script lang="ts">
    import { box, css } from '@styles'
    import type { Validators } from '@types'
  
    export let validators: Validators
  
    const frame = box({
      css: {
        display: 'flex',
        flexDirection: 'column'
      }
    })
  
    const validatorBox = css({
      display: 'grid',
      grid: `
        searchByName acceptingStake stakePrc ownerStake fee uptime searchByAddress .
        
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
  