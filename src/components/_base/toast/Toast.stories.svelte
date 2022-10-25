<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import { AlertToast } from './Toasts'
</script>

<Meta title="Toast" />

<button
  on:click={AlertToast({
    title: 'Error',
    text: 'An internal server error occurred.',
    type: 'error'
  })}
>
  Show error toast
</button>

<button
  on:click={AlertToast({
    title: 'Info',
    text: 'This is an info toast.',
    type: 'info'
  })}
>
  Show info toast
</button>

<button
  on:click={AlertToast({
    title: 'Warning',
    text: 'This is a warning toast.',
    type: 'warning'
  })}
>
  Show warning toast
</button>

<button
  on:click={AlertToast({
    title: 'Success',
    text: 'This is a success toast.',
    type: 'success'
  })}
>
  Show success toast
</button>

<Template />

<Story name="Primary" />
