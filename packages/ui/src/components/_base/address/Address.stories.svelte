<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Address from './Address.svelte'
</script>

<Meta title="Base Components / Address" component={Address} />

<Template let:args>
  <h1>Account</h1>
  <Address
    short={args.short}
    value={'account_tdx_c_1p9we7lz9az6fyarwzx2yxezx9ymfdtc6l4dsva4v36rqpek3pe'}
  />
</Template>

<Story name="Long" args={{ short: false }} />

<Story name="Short" args={{ short: true }} />
