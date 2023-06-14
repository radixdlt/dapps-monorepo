<script lang="ts">
  export let text: string
</script>

<textarea class="code-box" disabled value={text} />

<style>
  .code-box {
    width: 100%;
    height: 100%;
    padding: var(--space-sm);
    font-family: 'Hack';
    background-color: var(--colors-background);
    resize: none;
    border-radius: var(--radii-md);
  }
</style>
