<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import EntityFilterCard from '@dashboard/lib/recent-transactions/EntityFilterCard.svelte'
  import OptionsFilter from '@dashboard/lib/recent-transactions/OptionsFilter.svelte'
  import type { ManifestClass } from '@radixdlt/babylon-gateway-api-sdk'
  import { createEventDispatcher } from 'svelte'

  export let withdrawnFrom: string[] = []
  export let depositedTo: string[] = []
  export let badges: string[] = []
  export let resources: string[] = []
  export let affectedEntities: string[] = []
  export let transactionType: ManifestClass | undefined = undefined
  export let filterPanelOpen = false
  export let selectedTransactionStatus: { label: string; value: string } = {
    label: 'All',
    value: 'All'
  }

  const dispatch = createEventDispatcher<{
    'apply-filters': string
  }>()

  let selectedTransactionType:
    | { label: string; value: ManifestClass }
    | undefined

  const transactionTypeLabel = {
    General: 'General',
    Transfer: 'Transfer',
    PoolContribution: 'Pool Contribution',
    PoolRedemption: 'Pool Redemption',
    ValidatorStake: 'Validator Stake',
    ValidatorUnstake: 'Validator Unstake',
    ValidatorClaim: 'Validator Claim',
    AccountDepositSettingsUpdate: 'Account Deposit Settings Update'
  } as const

  if (transactionType) {
    selectedTransactionType = {
      label: transactionTypeLabel[transactionType],
      value: transactionType
    }
  }

  $: transactionType = selectedTransactionType?.value

  const applyFilters = async () => {
    const withdrawnFromParam =
      withdrawnFrom.length > 0
        ? `withdrawnFrom=${withdrawnFrom.join(',')}`
        : undefined

    const depositedToParam =
      depositedTo.length > 0
        ? `depositedTo=${depositedTo.join(',')}`
        : undefined

    const badgesParam =
      badges.length > 0 ? `badges=${badges.join(',')}` : undefined

    const resourcesParam =
      resources.length > 0 ? `resources=${resources.join(',')}` : undefined

    const affectedEntitiesParam =
      affectedEntities.length > 0
        ? `affectedEntities=${affectedEntities.join(',')}`
        : undefined

    const transactionTypeParam = transactionType
      ? `transactionType=${transactionType}`
      : undefined

    const transactionStatusParam = selectedTransactionStatus
      ? `transactionStatus=${selectedTransactionStatus.value}`
      : undefined

    const params = [
      withdrawnFromParam,
      depositedToParam,
      badgesParam,
      resourcesParam,
      affectedEntitiesParam,
      transactionTypeParam,
      transactionStatusParam
    ]
      .filter(Boolean)
      .join('&')

    dispatch('apply-filters', params)
  }
</script>

<SidePanel
  bind:open={filterPanelOpen}
  useBackdrop
  on:close={() => {
    filterPanelOpen = false
    applyFilters()
  }}
  --width="35rem"
>
  <SidePanelHeader
    text="Recent Transaction Filters"
    on:closeClick={() => {
      filterPanelOpen = false
      applyFilters()
    }}
  >
    <button
      class="clear-all"
      on:click={() => {
        withdrawnFrom = []
        depositedTo = []
        badges = []
        resources = []
        affectedEntities = []
        selectedTransactionType = undefined
      }}>Clear All</button
    >
  </SidePanelHeader>

  <div class="cards">
    <OptionsFilter
      title="Transaction Type"
      description="Show only transactions of this type."
      bind:selected={selectedTransactionType}
      options={[
        { label: transactionTypeLabel['General'], value: 'General' },
        { label: transactionTypeLabel['Transfer'], value: 'Transfer' },
        {
          label: transactionTypeLabel['PoolContribution'],
          value: 'PoolContribution'
        },
        {
          label: transactionTypeLabel['PoolRedemption'],
          value: 'PoolRedemption'
        },
        {
          label: transactionTypeLabel['ValidatorStake'],
          value: 'ValidatorStake'
        },
        {
          label: transactionTypeLabel['ValidatorUnstake'],
          value: 'ValidatorUnstake'
        },
        {
          label: transactionTypeLabel['ValidatorClaim'],
          value: 'ValidatorClaim'
        },
        {
          label: 'Account Deposit Settings Update',
          value: 'AccountDepositSettingUpdate'
        }
      ]}
    />

    <OptionsFilter
      title="Transaction Status"
      description="Show only transactions with the selected status"
      bind:selected={selectedTransactionStatus}
      options={[
        { label: 'Success', value: 'Success' },
        { label: 'Failure', value: 'Failure' },
        { label: 'All', value: 'All' }
      ]}
    />

    <EntityFilterCard
      title="Withdrawn From Account"
      description="Show only transactions with withdrawals from these accounts"
      bind:values={withdrawnFrom}
    />

    <EntityFilterCard
      title="Deposited To Account"
      description="Show only transactions with deposits to these accounts"
      bind:values={depositedTo}
    />

    <EntityFilterCard
      title="Badges"
      description="Show only transactions where these resources were presented as a badge"
      bind:values={badges}
    />

    <EntityFilterCard
      title="Resources"
      description="Shows only transactions which resulted in a non-fee balance change of this resource"
      bind:values={resources}
    />

    <EntityFilterCard
      title="Affected Entities"
      description="Show only transactions where these entities were updated or had balance changes"
      bind:values={affectedEntities}
    />
  </div>
</SidePanel>

<style lang="scss">
  .table-header {
    margin: 0 0 var(--spacing-md);
  }

  .cards {
    display: grid;
    gap: var(--spacing-lg);
  }

  .clear-all {
    color: var(--color-radix-blue-2);
    font-weight: var(--font-weight-bold-2);
  }
</style>
