<script lang="ts">
  import Button from "./Button.svelte"
</script>

<Button
  style={{
    backgroundColor: "$primary",
    "&:hover": {
      backgroundColor: "$primaryLight"
    }
  }}
>
  Connect
</Button>
