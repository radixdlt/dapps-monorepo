<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Layout from './Layout.svelte'
  import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit'
  import LayersIcon from '@icons/layers.svg'
  import TransactionsIcon from '@icons/transactions.svg'
  import TokensIcon from '@icons/tokens.svg'
  import NftsIcon from '@icons/nfts.svg'
  import DappMetadataIcon from '@icons/dapp-metadata.svg'
  import ValidatorsIcon from '@icons/validators-menu.svg'
  import { isMobileDevice } from '@stores'
  RadixDappToolkit({ dAppDefinitionAddress: '', networkId: 12 })
  const routes = $isMobileDevice
    ? []
    : [
        {
          text: 'Deploy Package',
          icon: LayersIcon,
          path: '/deploy-package'
        },
        {
          text: 'Send Raw Transaction',
          icon: TransactionsIcon,
          path: '/transaction-manifest'
        },
        {
          text: 'Send Tokens',
          icon: TokensIcon,
          path: '/send-tokens'
        },
        {
          text: 'Send NFTs',
          icon: NftsIcon,
          path: '/send-nft'
        },
        {
          text: 'Manage dApp Definition',
          icon: DappMetadataIcon,
          path: '/dapp-metadata'
        },
        {
          text: 'Validators',
          icon: ValidatorsIcon,
          path: '/validators'
        }
      ]
</script>

<Meta title="Layout" />

<Story name="Primary">
  <Layout {routes} />
</Story>

<style lang="scss">
  :global(body) {
    // storybook adds a padding to the body
    padding: 0 !important;
  }
</style>
