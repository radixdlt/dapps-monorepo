<script lang="ts">
  import Button from "./Button.svelte"
</script>

<Button
  style={{
    backgroundColor: "$primary",
    "&:hover": {
      filter: 'brightness(150%)'
    }
  }}
>
  Connect
</Button>
