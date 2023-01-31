<script>
  import { rdt } from '../../radix'
</script>

{#await rdt then}
  <radix-connect-button />
{/await}
