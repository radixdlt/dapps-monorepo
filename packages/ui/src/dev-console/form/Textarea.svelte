<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import type { ZodError, ZodSchema, ZodString } from 'zod'

  export let disabled = false
  export let placeholder = ''
  export let error = false
  export let value = ''
  export let rows = 1
  export let schema: ZodSchema | undefined = undefined
  let state = writable<'initial' | 'touched'>('initial')
  let zodError = writable<ZodError | undefined>(undefined)

  onMount(() => {
    if (schema) {
      const result = schema.safeParse(value)
      error = !result.success
    }
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

<div class="content">
  <slot name="before" />
  <textarea
    {placeholder}
    {rows}
    class:disabled
    class:error
    on:input
    bind:value
  />
  <slot name="after" />
</div>

{#if schema}
  {#if $zodError}
    {#each $zodError.issues as issue}
      <div class="error-message">{issue.message}</div>
    {/each}
  {/if}
{/if}

<style lang="scss">
  .content {
    border: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
    padding: 0.6rem 1rem;
    border-radius: 0.5rem;
    width: 100%;
    line-height: 1.5rem;
    display: flex;
  }

  textarea {
    border: none;
    overflow: auto;
    outline: none;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;

    resize: none;
  }

  textarea {
    border-width: 0;
    background: var(--theme-surface-2);
    width: 100%;
    line-height: 1.5rem;
    resize: vertical;
    &.disabled {
      user-select: none;
    }
    &.error {
      border-color: red;
    }
  }
  .error-message {
    color: var(--theme-error-primary);
  }
</style>
