<script lang="ts">
  import type { Requirement } from '@api/utils/auth'
  import ResourceProofRule from './ResourceProofRule.svelte'
  import type { TokenInfo } from '../TokenInfo'

  export let requirement: Requirement
  export let tokenInfo: TokenInfo

  let resourceName: string | undefined
  let resourceAddress: string
  let resourceSymbol: string | undefined
  let nftId: string | undefined
  let resourceIconUrl: string | undefined
  let nftName: string | undefined
  let nftIconUrl: string | undefined

  if (requirement.type === 'Resource') {
    const token = tokenInfo.fungibles.get(requirement.resource)
    resourceName = token?.metadata.standard.name?.value
    resourceIconUrl = token?.metadata.standard.icon_url?.value.href
    resourceSymbol = token?.metadata.standard.symbol?.value
    resourceAddress = requirement.resource
  } else {
    resourceAddress = requirement.non_fungible.resource_address
    nftId = requirement.non_fungible.local_id.simple_rep
    const resource = tokenInfo.nonFungibleResources.get(resourceAddress)
    const nft = tokenInfo.nonFungibles.get(`${resourceAddress}:${nftId}`)
    resourceName = resource?.metadata.standard.name?.value
    resourceIconUrl = resource?.metadata.standard.icon_url?.value.href
    nftName = nft?.nftData.expected.name?.value
    nftIconUrl = (nft?.nftData.expected as any).key_image_url?.value
  }
</script>

<ResourceProofRule
  {resourceName}
  {resourceAddress}
  {nftId}
  {resourceIconUrl}
  {resourceSymbol}
  {nftName}
  {nftIconUrl}
/>
