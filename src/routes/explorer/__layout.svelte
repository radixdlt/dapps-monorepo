<script lang="ts">
  import { goto } from '$app/navigation'
  import Button from '@components/button/Button.svelte'
  import Input from '@components/input/Input.svelte'
  import { css } from '@styles'

  let id: string

  const redirect = () => goto(`/explorer/transaction/${id}`)

  const grid = css({
    display: 'grid',
    grid: 'auto / 90% 10%',
    columnGap: 10
  })
</script>

<div class={grid()}>
  <Input bind:id placeholder="Enter Transaction ID" />
  <Button on:click={redirect}>Search</Button>
</div>

<slot />
