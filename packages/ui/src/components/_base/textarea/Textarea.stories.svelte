<script context="module">
  export const meta = {
    component: Textarea,
    argTypes: {
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
    }
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import Textarea from './Textarea.svelte'
</script>

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
