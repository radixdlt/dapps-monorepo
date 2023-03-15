<script lang="ts">
  import LoadingSpinner from './loading-spinner/LoadingSpinner.svelte'

  export let size: 'small' | 'large' = 'large'
  export let disabled: true | false = false
  export let loading = false
</script>

<button class={`button ${size}`} class:disabled on:click>
  {#if loading}
    <div class="loading-spinner">
      <LoadingSpinner />
    </div>
  {:else}
    <slot />
  {/if}
</button>

<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-primary-dark);
    border: none;
    cursor: pointer;
    border-radius: 10px;
    font-size: var(--text-md);
    color: var(--text-color);
    transition: color 0.2s, border-color 0.2s, background-color 0.2s;
  }

  .loading-spinner {
    height: 60%;
    aspect-ratio: 1/1;
  }

  .small {
    height: 2em;
    width: 4em;
    font-size: var(--text-sm);
  }

  .large {
    height: 3em;
    width: 6em;
    font-size: var(--text-md);
  }

  .disabled {
    background-color: transparent;
    color: var(--color-grey-0);
    cursor: not-allowed;
    border: var(--border);
  }
</style>
