<script lang="ts">
  import { goto } from '$app/navigation'
  import Input from '@components/input/Input.svelte'
  import { container } from './style'

  let id: string

  const search = () => goto(`/explorer/transaction/${id}`)
</script>

<div>
  <div class={container}>
    <form style:width="30%" on:submit={search}>
      <Input
        width="100%"
        bind:value={id}
        borderRadius="$lg"
        placeholder="Enter Transaction ID"
        icon="/images/search_icon.svg"
      />
    </form>
  </div>
  <slot />
</div>
