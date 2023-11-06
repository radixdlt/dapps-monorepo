<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import GridTable from './GridTable.svelte'

  const columns = [
    { header: { label: 'Name' }, id: 'name' },
    { header: { label: 'Age' }, id: 'age' },
    { header: { label: 'Job' }, id: 'job' },
    { header: { label: 'Favorite Color' }, id: 'favoriteColor' },
    { header: { label: 'Favorite Animal' }, id: 'favoriteAnimal' }
  ] as const
</script>

<Meta title="Base Components / Grid Table" />

<Story name="Primary">
  <GridTable {columns} let:Section>
    <div slot="header-cell" let:column>
      {column?.header?.label}
    </div>
    <Section {columns} let:columns>
      <Section {columns} renderAt="name">John</Section>
      <Section {columns} renderAt="age">30</Section>
      <Section {columns} renderAt="job">Software Engineer</Section>
      <Section
        {columns}
        renderAt={{ start: 'favoriteColor', end: 'favoriteAnimal' }}
        let:columns
      >
        <div class="favorites">
          <Section {columns} renderAt="favoriteColor">Pink</Section>
          <Section {columns} renderAt="favoriteAnimal">Unicorn</Section>
        </div>
      </Section>
    </Section>
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
