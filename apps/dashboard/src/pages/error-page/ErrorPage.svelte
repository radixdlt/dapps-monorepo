<script lang="ts">
  export let status: number | undefined = undefined
  export let message: string
  export let traceId: string | undefined = undefined
</script>

<div class="box">
  <header class="header">Error {status ?? ''}</header>

  <p class="text">
    {message}
  </p>

  <p class="subtext">
    {traceId ? `Trace ID: ${traceId}` : ''}
  </p>
</div>

<style lang="scss">
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-top: 50px;

    @include mixins.desktop {
      gap: 1rem;
      margin-top: 200px;
    }
  }

  .header {
    color: var(--theme-text-primary);
    font-size: 1.125rem;
    font-weight: var(--font-weight-bold-2);

    @include mixins.desktop {
      font-size: 2.25rem;
    }
  }

  .text {
    font-size: 1rem;
  }
</style>
