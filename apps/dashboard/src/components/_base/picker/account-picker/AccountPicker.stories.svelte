<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import AccountPicker from './AccountPicker.svelte'
  import type { Account } from '@stores'

  let selected: Account
</script>

<Meta title="Base Components / Picker / AccountPicker" />

<Story name="Primary">
  <div style="background: #F4F5F9; height:100vh;padding:40px">
    <div style="width:400px">
      <AccountPicker bind:selected />
    </div>
  </div>
</Story>
