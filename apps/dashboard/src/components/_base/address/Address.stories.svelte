<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Address from './Address.svelte'
</script>

<Meta title="Address" component={Address} />

<Template>
  <h1>Account</h1>
  <Address
    value={'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe'}
  />
</Template>

<Story name="Primary" />
