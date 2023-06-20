<script lang="ts">
  import Switch from '@components/_base/switch/Switch.svelte'

  export let title: string
  export let description: string
  export let on: boolean
</script>

<div id="switch-filter-card" class="card">
  <div id="text">
    <div id="title">
      {title}
    </div>
    <div id="description">
      {description}
    </div>
  </div>

  <Switch bind:on />
</div>

<style lang="scss">
  @use '../shared.scss';

  #switch-filter-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    #title {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-bold-3);
    }

    #description {
      font-size: var(--text-md);
      font-weight: var(--font-weight-bold-1);
      color: var(--theme-subtext);
    }
  }
</style>
