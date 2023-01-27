<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { addressToRoute } from '@utils'

  export let value: string[]
</script>

<Box wrapper>
  {#each value as entity}
    <Text color="link">
      <a href={addressToRoute(entity)}>
        {entity}
      </a>
    </Text>
  {/each}
</Box>
