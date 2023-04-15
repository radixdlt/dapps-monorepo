<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import ValidatorCard from '../ValidatorCard.svelte'

  export let validatorInfo: ComponentProps<ValidatorCard>
</script>

<ValidatorCard {...validatorInfo}>
  <Icon slot="icon" size="large" type="staking" />
</ValidatorCard>
