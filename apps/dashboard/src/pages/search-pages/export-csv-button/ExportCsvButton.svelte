<script lang="ts">
  import DatePickerInput from '@components/_base/date-picker/DatePickerInput.svelte'
  import dayjs from '@common/dayjs'
  import { onMount } from 'svelte'
  import DatePickerCalendar from '@components/_base/date-picker/DatePickerCalendar.svelte'
  import { fly } from 'svelte/transition'

  import IosShare from './IosShare.svelte'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import { exportTransactions } from './side-effects'

  export let entityAddress: string

  const dateFormat = 'DD/MM/YYYY'

  let open = false
  let isExporting = false

  let offset: number
  let picker: HTMLElement

  let customDateValue = {
    fromDate: '',
    toDate: '',
    fromDateObject: dayjs(),
    toDateObject: dayjs()
  }
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
      customDateValue = {
        fromDate: '',
        toDate: '',
        fromDateObject: dayjs(),
        toDateObject: dayjs()
      }
      selectingDate = undefined
    }
  }

  const _exportTransactions = (
    fromDateObject: dayjs.Dayjs,
    toDateObject: dayjs.Dayjs
  ) => {
    if (isExporting) return
    isExporting = true
    exportTransactions(fromDateObject, toDateObject, entityAddress).then(() => {
      isExporting = false
    })
  }

  const handleKnownRangeExport = (value: string) => {
    const getSubstractedDate = (hours: number) => {
      const now = dayjs.utc()
      return now.set('hours', now.get('hours') - hours)
    }
    const dates = {
      lastDay: getSubstractedDate(24),
      lastWeek: getSubstractedDate(24 * 7),
      lastMonth: getSubstractedDate(24 * 30)
    }

    _exportTransactions(
      dates[value as 'lastDay' | 'lastWeek' | 'lastMonth'],
      dayjs()
    )
  }

  const handleCustomExport = () => {
    _exportTransactions(
      customDateValue.fromDateObject,
      customDateValue.toDateObject
    )
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

<div class="picker" bind:this={picker}>
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
      in:fly|global={{ y: -10, duration: 150 }}
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
            on:change={(e) => {
              customDateValue.fromDateObject = dayjs.utc(
                customDateValue.fromDate,
                dateFormat
              )
            }}
            on:open-calendar={() => {
              selectingDate = 'fromDate'
            }}
          />
          <span>to</span>
          <DatePickerInput
            bind:value={customDateValue.toDate}
            on:change={(e) => {
              customDateValue.toDateObject = dayjs
                .utc(customDateValue.toDate, dateFormat)
                .set('hours', 24)
            }}
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
            disable={!customDateValue.fromDate ||
              !customDateValue.toDate ||
              customDateValue.fromDateObject.diff(
                customDateValue.toDateObject
              ) > 0}
          />
        </button>
      {/if}

      {#if selectingDate}
        <DatePickerCalendar
          bind:value={customDateValue[selectingDate]}
          on:datepicked={(e) => {
            if (selectingDate === 'fromDate') {
              customDateValue.fromDate = e.detail.datepicked
              customDateValue.fromDateObject = dayjs
                .utc(e.detail.datepicked, dateFormat)
                .set('hours', 0)
            } else if (selectingDate === 'toDate') {
              customDateValue.toDate = e.detail.datepicked
              customDateValue.toDateObject = dayjs
                .utc(e.detail.datepicked, dateFormat)
                .set('hours', 24)
            }

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
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    height: 40px;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: var(--color-grey-4);

    &.disabled {
      pointer-events: none;
    }

    @include mixins.desktop {
      width: 121px;
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
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    z-index: 1;
  }

  .drawer {
    max-width: 100vw;
    position: absolute;
    right: 0;
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

    @include mixins.desktop {
      right: -10px;
    }

    @media (max-width: 400px) {
      right: -25px;
    }
  }

  button.option.custom {
    cursor: unset;
  }
</style>
