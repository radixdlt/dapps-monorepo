<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Select from './Select.svelte'
  import Label from './Label.svelte'
</script>

<Meta title="Dev console / Form / Select" />

<Story name="Primary">
  <div class="content">
    <div class="variation">
      <Label>Owner role</Label>
      <Select placeholder="Select owner role" />
    </div>

    <div class="variation">
      <Label disabled>Owner role</Label>
      <Select placeholder="Select owner role" disabled />
    </div>

    <div class="variation">
      <Label>Owner role</Label>
      <Select
        placeholder="Select owner role"
        selected={1}
        items={[
          {
            id: 1,
            label:
              'resource_tdx_2_1nfxxxxxxxxxxpkgwnrxxxxxxxxx002558553505xxxxxxxxxfzgzzk'
          },
          { id: 2, label: 'Item 2' },
          { id: 3, label: 'Item 3' }
        ]}
      />
    </div>

    <div class="variation">
      <Label>Owner role</Label>
      <Select loading placeholder="Select owner role" />
    </div>
  </div>
</Story>

<style>
  .content {
    padding: 2rem;
    background-color: #f4f5f9;
  }
  .variation {
    margin-bottom: 2rem;
  }
</style>
