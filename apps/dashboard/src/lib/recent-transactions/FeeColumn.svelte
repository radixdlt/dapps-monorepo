<script lang="ts">
  import { xrdAddress } from '@stores'
  export let fee: string
</script>

<span class="fee">{Number(fee).toFixed(8)}</span>
<a href="/resource/{$xrdAddress}" class="link">XRD</a>

<style lang="scss">
  .fee {
    font-weight: var(--font-weight-bold-1);
  }
  .link:hover {
    text-decoration: underline;
  }
  .link {
    color: var(--theme-text-primary);
  }
</style>
