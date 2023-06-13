<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Popover from './Popover.svelte'

  let show = false
</script>

<Meta
  title="Popover"
  argTypes={{
    placement: {
      options: [
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end'
      ],
      control: { type: 'select' }
    }
  }}
/>

<Template let:args>
  <div style:padding="50px">
    <Popover type="error" placement={args.placement} bind:show>
      <div
        on:mouseenter={() => (show = true)}
        on:mouseleave={() => (show = false)}
      >
        Hover me
      </div>
      <div slot="content">Hello</div>
    </Popover>
  </div>
</Template>

<Story
  name="Primary"
  args={{
    placement: 'right'
  }}
/>
