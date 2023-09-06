<script lang="ts">
  
   import type { LayoutData } from '../$types'
    import LoadingInfoBox from '@components/info-box/LoadingInfoBox.svelte'
    import InfoBox from '@components/info-box/InfoBox.svelte'
    import Text from '@components/_base/text/Text.svelte'
    import Row from '@components/info-box/Row.svelte'
    import type { ReplaceProperty, StateEntityDetailsResponseComponentDetails, StateEntityDetailsResponseItem } from '@radixdlt/babylon-gateway-api-sdk'

  export let data: LayoutData & { promises: { entity: Promise<
    ReplaceProperty<
      StateEntityDetailsResponseItem,
      'details',
      StateEntityDetailsResponseComponentDetails
    >
  > } }
</script>

<div class="card">
  {#await data.promises.entity}
      <LoadingInfoBox />
    {:then details}
      {#if details}
        <InfoBox>
          <Row>
            <Text slot="left" bold align="right">Package Name</Text>
            <Text slot="right" align="left"
              >{details.details.blueprint_name}</Text
            >
          </Row>
          <Row>
            <Text slot="left" bold align="right">Package Address</Text>
            <Text slot="right" align="left"
              >{details.details.package_address}</Text
            >
          </Row>
        </InfoBox>
      {/if}
    {/await}
</div>
