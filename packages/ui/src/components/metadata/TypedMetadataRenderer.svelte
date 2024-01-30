<script lang="ts">
  import AddressesList from '@components/_base/address/AddressesList.svelte'
  import Link from '@components/_base/link/Link.svelte'
  import LinksList from '@components/_base/link/LinksList.svelte'
  import type { MetadataTypedValue } from '@common/gateway-sdk'

  export let metadataTypedValue: MetadataTypedValue | undefined
</script>

{#if metadataTypedValue}
  {#if metadataTypedValue.type === 'GlobalAddress'}
    <AddressesList autoShorten addresses={[metadataTypedValue.value]} />
  {:else if metadataTypedValue.type === 'GlobalAddressArray'}
    <AddressesList autoShorten addresses={metadataTypedValue.values} />
  {:else if metadataTypedValue.type === 'NonFungibleGlobalId'}
    <AddressesList
      autoShorten
      addresses={[
        `${metadataTypedValue.resource_address}:${metadataTypedValue.non_fungible_id}`
      ]}
    />
  {:else if metadataTypedValue.type === 'NonFungibleGlobalIdArray'}
    <AddressesList
      autoShorten
      addresses={metadataTypedValue.values.map(
        (value) => `${value.resource_address}:${value.non_fungible_id}`
      )}
    />
  {:else if metadataTypedValue.type === 'Origin'}
    <Link url={metadataTypedValue.value} external />
  {:else if metadataTypedValue.type === 'OriginArray'}
    <LinksList
      links={metadataTypedValue.values.map((url) => ({ url }))}
      external
    />
  {:else if metadataTypedValue.type === 'PublicKey'}
    {metadataTypedValue.value.key_type}({metadataTypedValue.value.key_hex})
  {:else if metadataTypedValue.type === 'PublicKeyArray'}
    {metadataTypedValue.values
      .map((value) => `${value.key_type}(${value.key_hex})`)
      .join(', ')}
  {:else if metadataTypedValue.type === 'PublicKeyHash'}
    {metadataTypedValue.value.key_hash_type}({metadataTypedValue.value
      .hash_hex})
  {:else if metadataTypedValue.type === 'PublicKeyHashArray'}
    {metadataTypedValue.values
      .map((value) => `${value.key_hash_type}(${value.hash_hex})`)
      .join(', ')}
  {:else if metadataTypedValue.type === 'Url'}
    <Link url={metadataTypedValue.value} external />
  {:else if metadataTypedValue.type === 'UrlArray'}
    <LinksList
      links={metadataTypedValue.values.map((url) => ({ url }))}
      external
    />
  {:else if metadataTypedValue.type === 'U8Array'}
    {metadataTypedValue.value_hex}
  {:else if metadataTypedValue.type === 'BoolArray' || metadataTypedValue.type === 'DecimalArray' || metadataTypedValue.type === 'I32Array' || metadataTypedValue.type === 'I64Array' || metadataTypedValue.type === 'NonFungibleLocalIdArray' || metadataTypedValue.type === 'StringArray' || metadataTypedValue.type === 'U32Array' || metadataTypedValue.type === 'U64Array'}
    {metadataTypedValue.values.join(', ')}
  {:else if metadataTypedValue.type === 'Bool' || metadataTypedValue.type === 'Decimal' || metadataTypedValue.type === 'I32' || metadataTypedValue.type === 'I64' || metadataTypedValue.type === 'NonFungibleLocalId' || metadataTypedValue.type === 'String' || metadataTypedValue.type === 'U32' || metadataTypedValue.type === 'U64' || metadataTypedValue.type === 'U8'}
    {metadataTypedValue.value}
  {:else if metadataTypedValue.type === 'Instant'}
    {new Date(Number(metadataTypedValue.value) * 1000)}
  {:else if metadataTypedValue.type === 'InstantArray'}
    {metadataTypedValue.values
      .map((value) => new Date(Number(value) * 1000))
      .join(', ')}
  {/if}
{/if}
