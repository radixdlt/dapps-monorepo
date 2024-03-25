<script lang="ts" context="module">
  export const meta = {
    component: InfoBar,
    argTypes: {
      message: {
        control: 'text'
      },
      type: {
        options: ['warning', 'default', 'error'],
        control: { type: 'select' }
      }
    }
  }
</script>

<script lang="ts">
  import { Template, Story } from '@storybook/addon-svelte-csf'
  import InfoBar from './InfoBar.svelte'
</script>

<Template let:args>
  <InfoBar message={args.message} type={args.type} />
</Template>

<Story
  name="Error"
  args={{
    message: 'This transaction has been committed to the ledger as a failure.',
    type: 'error'
  }}
/>

<Story
  name="Warning"
  args={{
    message: `A payload for this transaction has been accepted into a node’s mempool on the network. It’s possible but not certain that it will be committed to this network`,
    type: 'warning'
  }}
/>

<Story
  name="Default"
  args={{
    message:
      'This transaction cannot be summarized. Only the raw transaction manifest may be viewed'
  }}
/>
