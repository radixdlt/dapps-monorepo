<script lang="ts">
  export let header: string
  export let text: string
  export let link: string
</script>

<div
  style:margin-top="var(--spacing-xl)"
  style:margin-bottom="var(--spacing-sm)"
>
  <div style:font-weight="bold">{header}</div>
  <div>
    {text}
  </div>
  <a href={link} target="_blank">More information</a>
</div>
