<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { getNonFungibleIDs } from '@api/gateway'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let address: string

  $: ids = getNonFungibleIDs(address)
</script>

<Card>
  <Text bold size="large" slot="header">Non Fungibles</Text>
  <InfoBox slot="body">
    {#await ids}
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
    {:then { non_fungible_ids: { items } }}
      {#each items as { non_fungible_id }}
        <Row>
          <Text underlined color="link" slot="left" align="right" bold>
            <a href={`/nft/${address}:${non_fungible_id}`}>
              {non_fungible_id}
            </a>
          </Text>
        </Row>
      {/each}
    {/await}
    <Row />
  </InfoBox>
</Card>
