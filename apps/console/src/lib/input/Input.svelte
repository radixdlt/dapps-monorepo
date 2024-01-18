<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import type { ZodError, ZodSchema } from 'zod'

  export let disabled = false
  export let placeholder = ''
  export let error: boolean | string = false
  export let value = ''
  export let schema: ZodSchema | undefined = undefined
  export let ref: ((el: HTMLInputElement) => void) | undefined = undefined

  let element: HTMLInputElement
  let state = writable<'initial' | 'touched'>('initial')
  let zodError = writable<ZodError | undefined>(undefined)

  onMount(() => {
    if (schema) {
      const result = schema.safeParse(value)
      error = !result.success
    }
    if (ref) ref(element)
  })

  $: {
    if ($state === 'initial' && value) {
      $state = 'touched'
    }
  }

  $: {
    if (schema && $state === 'touched') {
      const result = schema.safeParse(value)
      if (!result.success) {
        $zodError = result.error
        error = true
      } else {
        $zodError = undefined
        error = false
      }
    }
  }
</script>

<div class="input-with-error">
  <div class="content" class:error={$state === 'touched' && !!error}>
    <input
      {placeholder}
      class:disabled
      on:input
      bind:value
      bind:this={element}
    />
  </div>

  {#if schema}
    {#if $zodError}
      {#each $zodError.issues as issue}
        <div class="error-message">{issue.message}</div>
      {/each}
    {/if}
  {/if}

  {#if error && typeof error === 'string'}
    <div class="error-message">{error}</div>
  {/if}
</div>

<style lang="scss">
  .input-with-error {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .content {
    border: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
    padding: 0.6rem 1rem;
    border-radius: 0.5rem;
    width: 100%;
    line-height: 1.5rem;
    display: flex;
    flex-direction: column;
    &.error {
      border-color: var(--theme-error-primary);
    }
  }

  input {
    width: 100%;
    &.disabled {
      user-select: none;
    }
  }
  .error-message {
    color: var(--theme-error-primary);
  }
</style>
