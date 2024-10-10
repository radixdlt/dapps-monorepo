<script lang="ts">
  import { type UptimeValue } from '@api/utils/entities/component/validator'
  import BasicHeader from '@components/_base/table/basic-header/BasicHeader.svelte'
  import UptimeSelector from '@dashboard/lib/validators/UptimeSelector.svelte'
  import type { ComponentProps } from 'svelte'

  export let selected: UptimeValue
  export let sorting: ComponentProps<BasicHeader>['sorting'] = undefined
</script>

<div class="header">
  <BasicHeader on:click {sorting}>uptime</BasicHeader>
  <UptimeSelector bind:selected />
</div>

<style lang="scss">
  .header {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
    justify-content: center;
    margin: 0 var(--spacing-lg);
  }
</style>
