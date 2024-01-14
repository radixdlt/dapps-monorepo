<script lang="ts">
  import { shortenAddress } from '@utils'

  export let id: string
  export let date: string

  $: [, day, month, , time] = new Date(date).toUTCString().split(' ')
  $: [hours, minutes] = time.split(':')
</script>

<div class="wrapper">
  <span class="bolder subtext">
    ID: <a href={`/transaction/${id}`}>{shortenAddress(id)}</a>
  </span>
  <span class="date subtext">{day} {month} • {hours}:{minutes}</span>
</div>

<style lang="scss">
  .bolder {
    font-weight: var(--font-weight-bold-2);
  }
  .subtext {
    color: var(--theme-subtext);
    text-align: left;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
