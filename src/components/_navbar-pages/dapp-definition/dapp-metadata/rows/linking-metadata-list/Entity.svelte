<script lang="ts" context="module">
  export type EntityT = {
    address: string
    requiredProof?: string
    validation?: EntityValidation
  }

  export type EntityValidation = (
    dappDefinition: string,
    linkedFromDapp: boolean,
    badges: { address: string }[]
  ) => Promise<ValidationResult>
</script>

<script lang="ts">
  import { getEntityDetails } from '@api/gateway'
  import { getSetMetadataAuth } from '@api/utils/auth'
  import { getStringMetadata } from '@api/utils/resources'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { StateEntityDetailsResponseItem } from '@radixdlt/babylon-gateway-api-sdk'
  import { ValidationResult } from '../../DappMetadata.svelte'
  import LinkingMetadataList from './LinkingMetadataList.svelte'

  export let entity: EntityT
  export let disabled: boolean

  let validationResult: ValidationResult

  $: showPopover = validationResult !== undefined

  let popoverStatus: 'error' | 'success'
  $: popoverStatus =
    validationResult === ValidationResult.LINKED ||
    validationResult === ValidationResult.WILL_BE_LINKED
      ? 'success'
      : 'error'

  const validateLinking: EntityValidation = async (
    ...[dappDefinition, linkedFromDapp, badges]: Parameters<EntityValidation>
  ) => {
    let details: StateEntityDetailsResponseItem

    try {
      details = await getEntityDetails(entity.address)
    } catch {
      validationResult = ValidationResult.INVALID_INPUT
      return ValidationResult.INVALID_INPUT
    }

    const linkedToDapp =
      getStringMetadata('dapp_definition')(details.metadata) === dappDefinition

    const auth = getSetMetadataAuth(details)

    if (auth) entity.requiredProof = auth

    const dappIsOwner =
      auth === 'AllowAll' || badges.some((badge) => badge.address === auth)

    if (linkedToDapp && linkedFromDapp) {
      validationResult = ValidationResult.LINKED
      return ValidationResult.LINKED
    }

    if (!linkedToDapp && dappIsOwner) {
      validationResult = ValidationResult.WILL_BE_LINKED
      return ValidationResult.WILL_BE_LINKED
    }

    if (!linkedToDapp && !dappIsOwner) {
      validationResult = ValidationResult.CANT_LINK
      return ValidationResult.CANT_LINK
    }

    return ValidationResult.INVALID_INPUT
  }

  entity.address = entity.address || ''
  entity.requiredProof = entity.requiredProof || ''
  entity.validation = validateLinking
</script>

<LinkingMetadataList
  on:input
  bind:input={entity.address}
  {disabled}
  {showPopover}
  {popoverStatus}
  placeholder="Account, package, resource or component address"
>
  {#if validationResult !== undefined}
    {#if validationResult === ValidationResult.LINKED}
      <div style:display="flex" style:gap="0.3rem" style:flex-direction="row">
        <Icon filter="" height="xs" width="xs" type="greenCheck" />
        <Text size="small">Linked</Text>
      </div>
    {/if}

    {#if validationResult === ValidationResult.WILL_BE_LINKED}
      <Text size="small">Will be linked when update is submitted</Text>
    {/if}

    {#if validationResult === ValidationResult.CANT_LINK}
      <Text size="small">
        Required badge to add confirming metadata to this resource is not
        available
      </Text>
    {/if}

    {#if validationResult === ValidationResult.INVALID_INPUT}
      <Text size="small">Invalid input</Text>
    {/if}
  {/if}
</LinkingMetadataList>
