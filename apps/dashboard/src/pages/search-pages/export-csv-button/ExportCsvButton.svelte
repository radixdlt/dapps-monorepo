<script lang="ts">
  import DatePickerInput from '@components/_base/date-picker/DatePickerInput.svelte'
  import dayjs from '@common/dayjs'
  import { onMount } from 'svelte'
  import { downloadBinaryFile } from '@common/http'
  import DatePickerCalendar from '@components/_base/date-picker/DatePickerCalendar.svelte'
  import { fly } from 'svelte/transition'

  import IosShare from './IosShare.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import { getDownloadLink } from './side-effects'

  export let entityAddress: string

  let open = false
  let isExporting = false

  let width: number
  let offset: number
  let picker: HTMLElement

  let customDateValue = { fromDate: '', toDate: '' }
  let selectingDate: 'fromDate' | 'toDate' | undefined

  const options = [
    {
      label: 'Last 24 hours',
      value: 'lastDay'
    },
    {
      label: 'Last 7 days',
      value: 'lastWeek'
    },
    {
      label: 'Last 30 days',
      value: 'lastMonth'
    }
  ]

  $: {
    if (open) {
      customDateValue = { fromDate: '', toDate: '' }
      selectingDate = undefined
    }
  }

  const exportTransactions = (fromDate: string, toDate: string) => {
    isExporting = true
    downloadBinaryFile(
      getDownloadLink(fromDate, toDate, entityAddress),
      'transactions.csv'
    ).finally(() => {
      isExporting = false
    })
  }

  const handleKnownRangeExport = (value: string) => {
    if (isExporting) return
    const getSubstractedDate = (hours: number) => {
      const now = new Date()
      now.setHours(now.getHours() - hours)
      return now
    }
    const currentDate = new Date()
    const dates = {
      lastDay: getSubstractedDate(24),
      lastWeek: getSubstractedDate(24 * 7),
      lastMonth: getSubstractedDate(24 * 30)
    }

    exportTransactions(
      dates[value as 'lastDay' | 'lastWeek' | 'lastMonth'].toISOString(),
      currentDate.toISOString()
    )
  }

  const handleCustomExport = () => {
    const fromDate = dayjs.utc(customDateValue.fromDate, 'DD/MM/YYYY')
    const toDate = dayjs
      .utc(customDateValue.toDate, 'DD/MM/YYYY')
      .set('hours', 24)

    exportTransactions(fromDate.toISOString(), toDate.toISOString())
  }

  onMount(() => {
    const handleClick = (event: any) => {
      if (!picker.contains(event.target)) {
        open = false
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => document.removeEventListener('click', handleClick, true)
  })
</script>

<div class="picker" bind:clientWidth={width} bind:this={picker}>
  <button
    class="export-csv-button"
    class:disabled={isExporting}
    on:click={() => (open = !open)}
    bind:clientHeight={offset}
  >
    {#if isExporting}
      <div style:height="80%" style:aspect-ratio="1/1">
        <LoadingSpinner />
      </div>
    {:else}
      <IosShare /> Export CSV
    {/if}
  </button>

  {#if open}
    <div
      class="drawer"
      class:calendar={selectingDate}
      style:transform={`translateY(${offset}px)`}
      in:fly={{ y: -10, duration: 150 }}
    >
      {#if !selectingDate}
        {#each options as option}
          <button
            class="option"
            on:click={() => {
              handleKnownRangeExport(option.value)
              open = false
            }}
          >
            {option.label}
            <IosShare rotate />
          </button>
        {/each}
        <button class="option custom">
          <span>Custom:</span>
          <DatePickerInput
            bind:value={customDateValue.fromDate}
            on:open-calendar={() => {
              selectingDate = 'fromDate'
            }}
          />
          <span>to</span>
          <DatePickerInput
            bind:value={customDateValue.toDate}
            on:open-calendar={() => {
              selectingDate = 'toDate'
            }}
          />
          <IosShare
            on:click={() => {
              handleCustomExport()
              open = false
            }}
            rotate
            disable={!customDateValue.fromDate || !customDateValue.toDate}
          />
        </button>
      {/if}

      {#if selectingDate}
        <DatePickerCalendar
          bind:value={customDateValue[selectingDate]}
          on:datepicked={(e) => {
            selectingDate = undefined
          }}
        />
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .export-csv-button {
    color: var(--color-radix-blue-2);
    font-weight: var(--font-weight-bold-2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    width: 121px;
    height: 40px;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: var(--color-grey-4);

    &.disabled {
      pointer-events: none;
    }
  }

  .option {
    display: flex;
    justify-content: space-between;
    padding: 15px 15px 15px 28px;
    width: 100%;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-grey-4);
    }
  }

  .picker {
    display: inline-flex;
    flex-direction: column;
    z-index: 1;
  }

  .drawer {
    position: absolute;
    right: -10px;
    width: 420px;
    overflow-y: auto;
    border-radius: 10px;
    margin-top: 10px;
    box-shadow: var(--shadow);
    border: 1px solid var(--color-grey-4);
    background: var(--color-light);
    transition: width 70ms ease-in;

    &.calendar {
      width: 306px;
      padding-top: 1rem;
    }
  }

  button.option.custom {
    cursor: unset;
  }
</style>
