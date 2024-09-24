<script lang="ts" context="module">
  export const getDateParts = (date: string) => {
    const dateObject = new Date(date)
    const [, day, , year, time] = dateObject.toUTCString().split(' ')
    const month = dateObject.toLocaleString('en-us', {
      month: 'long',
      timeZone: 'UTC'
    })
    const [hours, minutes] = time.split(':')
    const currentYear = String(new Date().getFullYear())
    return {
      day,
      year,
      month,
      hours,
      minutes,
      currentYear
    }
  }
</script>

<script lang="ts">
  import { shortenAddress } from '@utils'

  export let id: string
  export let date: string

  const { day, year, month, hours, minutes, currentYear } = getDateParts(date)
</script>

<div class="wrapper">
  <span class="bolder subtext">
    <a href={`/transaction/${id}`}>{shortenAddress(id)}</a>
  </span>
  <span class="date subtext"
    >{day} {month} {year !== currentYear ? year : ''} • {hours}:{minutes}</span
  >
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
