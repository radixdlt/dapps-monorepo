<script lang="ts">
  import { shortenAddress } from '@utils'

  export let id: string
  export let date: string

  $: [, day, , year, time] = new Date(date).toUTCString().split(' ')
  $: month = new Date(date).toLocaleString('en-us', { month: 'long' })
  $: [hours, minutes] = time.split(':')
  $: currentYear = String(new Date().getFullYear())
</script>

<div class="wrapper">
  <span class="bolder subtext">
    <a href={`/transaction/${id}`}>{shortenAddress(id)}</a>
  </span>
  <span class="date subtext">{day} {month} {year !== currentYear ? year : ''} • {hours}:{minutes}</span>
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
