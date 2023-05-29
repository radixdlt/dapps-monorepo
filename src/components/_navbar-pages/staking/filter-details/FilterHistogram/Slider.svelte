<script lang="ts">
  let pos = 0

  $: console.log(pos)
</script>

<div id="slider">
  <div
    class="thumb"
    style:left={`${pos * 100}%`}
    on:drag={({ detail }) => (pos = detail)}
  />
</div>

<style>
  .thumb {
    width: 20px;
    height: 20px;
    background: var(--color-radix-blue-2);
    border-radius: 50%;
  }
</style>
