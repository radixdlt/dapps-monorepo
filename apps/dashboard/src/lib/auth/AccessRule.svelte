<script lang="ts">
  export let name: string
</script>

<div class="access-rule card">
  <div class="header">
    <h4 class="name">
      {name}
    </h4>
  </div>

  <slot name="content" />
</div>

<style>
  .access-rule {
    background: linear-gradient(
      45deg,
      var(--color) 10%,
      var(--theme-surface-2)
    );
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: var(--spacing-md);
  }

  .name {
    text-transform: uppercase;
  }
</style>
