<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import dayjs from '@common/dayjs'
  import IconNew from '../icon/IconNew.svelte'
  import ChevronRight from '@icons/chevron-right.svg'

  export let value: string
  export let format = 'DD/MM/YYYY'

  const weekdaysShort = dayjs.weekdaysShort()
  const dispatch = createEventDispatcher()

  let rows = initRows()
  let currentDay: number // 1..31
  let currentMonth: number // 1..12
  let currentYear: number // 2023..
  let selectedMonth: number // 1..12
  let selectedYear: number // 2021...

  $: {
    const params = value ? [value, format] : []

    // reactivity, on external value changes
    currentDay = +dayjs(...params).format('D')
    currentMonth = +dayjs(...params).format('M')
    currentYear = +dayjs(...params).format('YYYY')

    // can be changed from within datepicker calendar, does not affect external value
    // but will be changed when external value changes
    selectedMonth = +dayjs(...params).format('M')
    selectedYear = +dayjs(...params).format('YYYY')
  }

  onMount(() => updateRows())

  function initRows() {
    return [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ]
  }

  function updateRows() {
    rows = initRows()
    const firstDayOfCurrentMonth = dayjs(selectedYear + '-' + selectedMonth)
      .startOf('month')
      .format('ddd')
    const lastDayOfCurrentMonth = +dayjs(selectedYear + '-' + selectedMonth)
      .endOf('month')
      .format('D')
    let iRow = 0
    let iCol = 0
    let start = false
    let cpt = 0
    for (iRow = 0; iRow < 6; iRow++) {
      weekdaysShort.forEach((daystr) => {
        if (cpt > lastDayOfCurrentMonth) {
          return
        }
        if (!start && daystr === firstDayOfCurrentMonth) {
          cpt++
          start = true
        }
        rows[iRow][iCol] = cpt
        iCol++
        if (start) {
          cpt++
        }
      })
      iCol = 0
    }
  }

  function previousMonth() {
    selectedMonth--
    if (selectedMonth <= 0) {
      selectedMonth = 12
      selectedYear--
    }
    updateRows()
  }

  function nextMonth() {
    selectedMonth++
    if (selectedMonth > 12) {
      selectedMonth = 1
      selectedYear++
    }
    updateRows()
  }

  function selectDate(y: number, m: number, d: number) {
    value = dayjs([y, m, d].join('-')).format(format)

    dispatch('datepicked', {
      datepicked: value
    })
  }
</script>

<section class="header">
  <span class="month-year"
    >{dayjs([selectedYear, selectedMonth].join('-')).format('MMMM YYYY')}</span
  >
  <div class="buttons">
    <button on:click={previousMonth} class="rotate-180">
      <IconNew icon={ChevronRight} --size="20px" />
    </button>
    <button on:click={nextMonth}>
      <IconNew icon={ChevronRight} --size="20px" />
    </button>
  </div>
</section>
<div class="days">
  <table>
    <thead>
      <tr>
        {#each weekdaysShort as day}
          <th>
            {day}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as col}
        <tr>
          {#each col as i}
            <td
              class="day-cell"
              class:empty={i === 0}
              class:current-day={i === currentDay &&
                selectedMonth === currentMonth &&
                selectedYear === currentYear}
              on:keypress={() => {
                selectDate(selectedYear, selectedMonth, i)
              }}
              on:click={() => {
                selectDate(selectedYear, selectedMonth, i)
              }}
            >
              {#if i > 0}
                {i}
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  table {
    width: 100%;
    border-spacing: 8px;
  }

  thead th {
    text-transform: uppercase;
    font-size: 0.625rem;
    letter-spacing: 1.5px;
    font-weight: 500;
    text-align: center;
    color: var(--color-grey-2);
  }

  tbody td {
    height: 30px;
    width: 30px;
  }

  thead th {
    height: 20px;
    width: 30px;
  }

  .rotate-180 {
    transform: rotate(180deg);
  }

  .current-day {
    border-radius: 50%;
    font-weight: 500;
    color: #ffffff;
    background-color: var(--color-grey-1);
  }

  .days-array {
    display: flex;
    justify-content: center;
    width: 100%;
    text-transform: uppercase;
  }

  .day-cell {
    text-align: center;

    &:not(.empty) {
      cursor: pointer;
    }

    &.empty {
      height: 0;
      pointer-events: none;
    }
  }

  .header {
    display: flex;
    padding: 0 1rem;
    align-items: center;
    justify-content: space-between;
  }

  .month-year {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    color: var(--color-dark);
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .days {
    display: flex;
    overflow-x: auto;
    padding-top: 1.5rem;
    justify-content: space-between;
    align-items: center;
  }
</style>
