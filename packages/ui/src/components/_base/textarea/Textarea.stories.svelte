<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Textarea from './Textarea.svelte'
</script>

<Meta
  title="Textarea"
  component={Textarea}
  argTypes={{
    size: {
      options: ['small', 'medium', 'large'],
      control: {
        type: 'select'
      }
    },
    type: {
      options: ['static', 'dynamic'],
      control: { type: 'radio' }
    }
  }}
/>

<Template let:args>
  <Textarea
    size={args.size === 'small' ? 'sm' : args.size === 'medium' ? 'md' : 'lg'}
    dynamic={args.type === 'dynamic'}
  />
</Template>

<Story
  name="Primary"
  args={{
    size: 'Size',
    type: 'Type'
  }}
/>
