<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import GridTable from './GridTable.svelte'

  const columns = [
    { header: { label: 'Name' }, id: 'name', sortBy: 'name' },
    { header: { label: 'Age' }, id: 'age', sortBy: 'age' },
    { header: { label: 'Job' }, id: 'job', sortBy: 'job' },
    {
      header: { label: 'Favorite Color' },
      id: 'favoriteColor',
      sortBy: 'favoriteColor'
    },
    {
      header: { label: 'Favorite Animal' },
      id: 'favoriteAnimal',
      sortBy: 'favoriteAnimal'
    }
  ] as const

  let rows = [
    {
      name: 'John',
      age: 30,
      job: 'Software Engineer',
      favoriteColor: 'Pink',
      favoriteAnimal: 'Unicorn'
    },
    {
      name: 'Jane',
      age: 25,
      job: 'Doctor',
      favoriteColor: 'Blue',
      favoriteAnimal: 'Dog'
    },
    {
      name: 'Bob',
      age: 40,
      job: 'Lawyer',
      favoriteColor: 'Green',
      favoriteAnimal: 'Cat'
    }
  ]

  const columnIds = columns.map((column) => column.id)
</script>

<Meta title="Base Components / Grid Table" />

<Story name="Primary">
  <GridTable {columns}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      slot="header-cell"
      let:column
      let:sort
      on:click={() => (rows = sort()(rows))}
    >
      {column?.header?.label}
    </div>

    <svelte:fragment slot="rows" let:Section>
      {#each rows as row}
        <Section {columnIds}>
          <Section {columnIds} renderAt="name">{row.name}</Section>
          <Section {columnIds} renderAt="age">{row.age}</Section>
          <Section {columnIds} renderAt="job">{row.job}</Section>
          <Section
            {columnIds}
            renderAt={{ start: 'favoriteColor', end: 'favoriteAnimal' }}
            let:columnIds
          >
            <div class="favorites">
              <Section {columnIds} renderAt="favoriteColor"
                >{row.favoriteColor}</Section
              >
              <Section {columnIds} renderAt="favoriteAnimal"
                >{row.favoriteAnimal}</Section
              >
            </div>
          </Section>
        </Section>
      {/each}
    </svelte:fragment>
  </GridTable>
</Story>

<style>
  .favorites {
    grid-column: 1 / 3;
    display: grid;
    grid-template-columns: subgrid;
    background: pink;
  }
</style>
