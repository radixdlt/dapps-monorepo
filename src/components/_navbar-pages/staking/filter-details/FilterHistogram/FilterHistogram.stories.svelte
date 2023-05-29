<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import FilterHistogram from './FilterHistogram.svelte'

  let values = Array(100)
    .fill(0)
    .map(() => Math.random() * 100)

  let _min: number
  let _max: number
</script>

<Meta title="Navbar Pages / Validators / FilterHistogram" />

<Story name="primary">
  <FilterHistogram
    {values}
    on:new-range={({ detail: { min, max } }) => {
      _min = min
      _max = max
    }}
  />
  <div id="text">
    Filter range: {_min} - {_max}
  </div>
</Story>

<style>
  #text {
    margin-top: 20px;
  }
</style>
