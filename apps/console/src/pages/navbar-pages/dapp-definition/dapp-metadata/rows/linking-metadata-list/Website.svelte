<script lang="ts" context="module">
  export type WebsiteT = {
    url: string
    validation?: WebsiteValidation
  }

  export type WebsiteValidation = (
    dappDefinition: string,
    linkedFromDapp: boolean
  ) => Promise<ValidationResult>
</script>

<script lang="ts">
  import Icon from '@components/_base/icon/Icon.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { ValidationResult } from '../../DappMetadata.svelte'
  import LinkingMetadataList from './LinkingMetadataList.svelte'
  import GreenCheckIcon from '@icons/green-check.svg'

  export let website: WebsiteT
  export let faded: boolean

  let validationResult: ValidationResult

  $: showPopover = validationResult !== undefined || invalidUrl

  $: invalidUrl =
    website.url !== '' && !faded && !website.url.startsWith('https://')

  let popoverStatus: 'error' | 'success'
  $: popoverStatus =
    validationResult === ValidationResult.LINKED ||
    validationResult === ValidationResult.WILL_BE_LINKED
      ? 'success'
      : 'error'

  const validateLinking: WebsiteValidation = async (
    dappDefinition: string,
    linkedFromDapp: boolean
  ) => {
    const websiteLinksToDapp = await (async () => {
      try {
        new URL(website.url)
      } catch {
        return Promise.resolve(false)
      }

      return true
    })()

    if (websiteLinksToDapp && linkedFromDapp) {
      validationResult = ValidationResult.LINKED
      return ValidationResult.LINKED
    }

    if (websiteLinksToDapp && !linkedFromDapp) {
      validationResult = ValidationResult.WILL_BE_LINKED
      return ValidationResult.WILL_BE_LINKED
    }

    if (!websiteLinksToDapp) {
      validationResult = ValidationResult.CANT_LINK
      return ValidationResult.CANT_LINK
    }

    return ValidationResult.INVALID_INPUT
  }

  let cantLinkMessage: string
  $: {
    website.url
    if (validationResult === ValidationResult.CANT_LINK)
      cantLinkMessage = (() => {
        try {
          new URL(website.url)
        } catch {
          return 'Invalid URL'
        }
        return `No confirmation for this dApp Definition found at: ${
          new URL(website.url).origin
        }/.well-known/radix.json`
      })()
  }

  website.validation = validateLinking
</script>

<LinkingMetadataList
  bind:input={website.url}
  on:input
  placeholder="Example: https://www.radixdlt.com"
  {showPopover}
  {popoverStatus}
>
  <div>
    {#if validationResult !== undefined}
      {#if validationResult === ValidationResult.LINKED}
        <div style:display="flex" style:gap="0.3rem" style:flex-direction="row">
          <Icon filter="" height="xs" width="xs" icon={GreenCheckIcon} />
          <Text size="small">Linked</Text>
        </div>
      {/if}

      {#if validationResult === ValidationResult.WILL_BE_LINKED}
        <Text size="small">Will be linked when update is submitted.</Text>
      {/if}

      {#if validationResult === ValidationResult.CANT_LINK}
        <Text size="small">
          {cantLinkMessage}
        </Text>
      {/if}
    {/if}
    {#if invalidUrl}
      <Text size="small">url must begin with https://</Text>
    {/if}
  </div>
</LinkingMetadataList>
