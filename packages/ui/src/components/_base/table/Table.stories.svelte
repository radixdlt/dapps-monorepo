<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Table from './Table.svelte'
  import type { ComponentProps } from 'svelte'

  const stakeEntries = [
    {
      value1: 'a',
      value2: 0,
      value3: true,
      value4: {
        fruit: 'apple',
        tastiness: 10
      }
    },
    {
      value1: 'b',
      value2: 1,
      value3: false,
      value4: {
        fruit: 'banana',
        tastiness: 5
      }
    },
    {
      value1: 'c',
      value2: 2,
      value3: true,
      value4: {
        fruit: 'cherry',
        tastiness: 7
      }
    },
    {
      value1: 'd',
      value2: 3,
      value3: false,
      value4: {
        fruit: 'durian',
        tastiness: 1
      }
    }
  ]

  const simpleTableConfig: ComponentProps<
    Table<(typeof stakeEntries)[number]>
  >['columns'] = [
    {
      label: 'Letter'
    },
    {
      label: 'Number',

      sortBy: 'value2'
    },
    {
      label: 'Boolean',

      sortBy: 'value3'
    },
    {
      label: 'Fruit',
      sortBy: (a, b) => a.value4.tastiness - b.value4.tastiness
    }
  ]
</script>

<Meta title="Base Components / Table" />

<Story name="Primary">
  <Table entries={stakeEntries} columns={simpleTableConfig}>
    <button slot="header-cell" let:column let:sort on:click={sort}>
      {column?.label}
    </button>

    <svelte:fragment slot="row" let:entry>
      <tr>
        <td>
          {entry.value1}
        </td>
        <td>
          {entry.value2}
        </td>
        <td>
          {entry.value3}
        </td>
        <td>
          {entry.value4.fruit}
        </td>
      </tr>
    </svelte:fragment>
  </Table>
</Story>
