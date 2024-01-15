<script lang="ts">
  import CodeBox from '@components/code-box/CodeBox.svelte'

  export let state: Record<string, unknown>
</script>

<div class="card">
  <CodeBox
    text={JSON.stringify(state, null, 2)}
    --code-box-min-height="40rem"
  />
</div>
