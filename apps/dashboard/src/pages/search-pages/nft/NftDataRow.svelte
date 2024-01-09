<script lang="ts">
  import { transformTupleGlobalIdToAddress } from '@api/utils/nft-data'
  import Accordion from '@components/_base/accordion/Accordion.svelte'
  import Address from '@components/_base/address/Address.svelte'
  import Link from '@components/_base/link/Link.svelte'
  import Row from '@components/info-box/Row.svelte'
  import type {
    ProgrammaticScryptoSborValue,
    ProgrammaticScryptoSborValueArray
  } from '@radixdlt/babylon-gateway-api-sdk'

  export let value: ProgrammaticScryptoSborValue

  const isComplexType = (value: ProgrammaticScryptoSborValue) => {
    return (
      value.kind === 'Array' ||
      value.kind === 'Enum' ||
      value.kind === 'Map' ||
      (value.kind === 'Tuple' && value.type_name !== 'NonFungibleGlobalId') ||
      value.kind === 'Own' ||
      value.kind === 'Bytes'
    )
  }

  const isSimpleKind = (kind: string) => {
    return [
      'String',
      'U8',
      'U16',
      'U32',
      'U64',
      'U128',
      'I32',
      'I64',
      'I16',
      'I8',
      'I128',
      'Bool',
      'Decimal',
      'PreciseDecimal'
    ].includes(kind)
  }

  const stringifyArray = (value: ProgrammaticScryptoSborValueArray): string => {
    return value.elements.map((element: any) => element.value).join(', ')
  }
</script>

{#if isComplexType(value)}
  <Row>
    <Accordion>
      <div class="accordion-header" slot="header">
        <div class="label">{value.field_name}</div>
        <div class="right-slot">
          Complex Data Type ({[value.kind, value.type_name]
            .filter(Boolean)
            .join(' - ')})
        </div>
      </div>

      <svelte:fragment slot="content">
        {#if value.kind === 'Array'}
          {#if isSimpleKind(value.element_kind) && value.elements.every( (element) => isSimpleKind(element.kind) )}
            <pre>{stringifyArray(value)}</pre>
          {:else}
            <pre>{JSON.stringify(value, null, 2)}</pre>
          {/if}
        {:else if value.kind === 'Enum'}
          <pre>{JSON.stringify(value, null, 2)}</pre>
        {:else if value.kind === 'Map'}
          <pre>{JSON.stringify(value, null, 2)}</pre>
        {:else if value.kind === 'Tuple'}
          <pre>{JSON.stringify(value, null, 2)}</pre>
        {:else if value.kind === 'NonFungibleLocalId'}
          <pre>{JSON.stringify(value, null, 2)}</pre>
        {:else if value.kind === 'Own'}
          <pre>{JSON.stringify(value, null, 2)}</pre>
        {/if}
      </svelte:fragment>
    </Accordion>
  </Row>
{:else}
  <Row>
    <div slot="left" class="label">{value.field_name}</div>
    <div slot="right" class="right-slot">
      {#if value.kind === 'String' && value.type_name === 'Url'}
        <Link url={value.value} external />
      {:else if value.kind === 'NonFungibleLocalId' || value.kind === 'String' || value.kind === 'U8' || value.kind === 'U16' || value.kind === 'U32' || value.kind === 'U64' || value.kind === 'U128' || value.kind === 'I32' || value.kind === 'I64' || value.kind === 'I16' || value.kind === 'I8' || value.kind === 'I128' || value.kind === 'Bool' || value.kind === 'Decimal' || value.kind === 'PreciseDecimal'}
        {value.value}
      {:else if value.kind === 'Reference'}
        <Address value={value.value} --background="var(--color-grey-5)" />
      {:else if value.kind === 'Bytes'}
        {value.hex}
      {:else if value.kind === 'Tuple' && value.type_name === 'NonFungibleGlobalId'}
        <Address
          value={transformTupleGlobalIdToAddress(value)}
          --background="var(--color-grey-5)"
        />
      {/if}
    </div>
  </Row>
{/if}

<style lang="scss">
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-bottom: 0;
  }
  :global(.accordion) {
    width: 100%;
  }

  :global(.subheader-icon .icon) {
    margin-right: 0 !important;
    margin-left: var(--spacing-lg) !important;
  }

  :global(.subheader-icon) {
    position: relative !important;
    top: 0 !important;
  }

  .accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .label {
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 1rem;
    margin-right: 2rem;
    word-break: break-all;

    @include mixins.desktop {
      margin-bottom: 0;
      min-width: 30%;
    }
  }
  .right-slot {
    text-align: right;
    display: flex;
    align-items: center;
    gap: 10px;
    word-break: break-all;
  }
</style>
