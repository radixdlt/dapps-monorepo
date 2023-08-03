<script lang="ts">
  import Icon from '../icon/Icon.svelte'
  import SearchIcon from '@icons/search.svg'

  export let onSearch: (address: string) => void
  export let placeholder: string = ''

  let value: string = ''

  const search = () => {
    onSearch(value)
    value = ''
  }
</script>

<form class="form" on:submit|preventDefault={search}>
  <div class="search">
    <input bind:value {placeholder} type="text" />
    <Icon on:click={() => onSearch(value)} interactive icon={SearchIcon} />
  </div>
</form>

<style lang="scss">
  .form {
    width: 100%;
    height: 100%;
  }
  .search {
    height: 100%;
    border: var(--border) var(--theme-border);
    border-radius: 2.75rem;
    padding: 0 var(--spacing-md) 0 var(--spacing-xl);
    display: flex;
    align-items: center;

    input {
      border-right: var(--border) var(--theme-border);
      margin-right: var(--spacing-sm);
      padding-right: var(--spacing-md);
      width: 100%;
    }
  }
</style>
