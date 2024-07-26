<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import InfoBox from './InfoBox.svelte'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'
  import { TransactionStatus } from '@common/gateway-sdk'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import { createEventDispatcher } from 'svelte'

  export let sidePanelHeader: string
  export let stakeButtonDisabled = false
  export let useBackdrop = false
  export let learnMoreUrl = ''

  const dispatch = createEventDispatcher<{
    close: null | 'invalidate'
    'tx-response': { status: TransactionStatus }
  }>()
</script>

<SidePanel {useBackdrop} on:close>
  <SidePanelHeader
    text={sidePanelHeader}
    on:closeClick={() => dispatch('close')}
  />

  <div class="flex">
    <div />
    <slot name="account-picker" />
  </div>

  <div
    class="heading-text flex"
    style:margin-top={`${
      $$slots['account-picker'] ? 'var(--spacing-2xl)' : ''
    }`}
  >
    <h4><slot name="heading-text" /></h4>
    <div class="align-left heading-subtext">
      <slot name="heading-subtext" />
    </div>
  </div>

  <slot name="content" />

  <div class="stake flex">
    <div class="info">
      <InfoBox link={{ href: learnMoreUrl, text: 'Learn more' }}>
        <slot name="info-box-title" slot="title" />
        <slot name="info-box-explanation" slot="explanation" />
      </InfoBox>
    </div>
    <div class="summary">
      <slot name="summary" />
      <div class="stake-button">
        <SendTxButton
          on:click
          on:response={(e) => {
            if (e.detail.status === TransactionStatus.CommittedSuccess) {
              dispatch('close', 'invalidate')
            }
            dispatch('tx-response', e.detail)
          }}
          buttonProps={{ size: 'xl', disabled: stakeButtonDisabled }}
        />
      </div>
    </div>
  </div>
</SidePanel>

<style lang="scss">
  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: var(--spacing-lg);
    @include mixins.mobile {
      flex-wrap: wrap;
    }

    .align-left {
      text-align: left;
    }
  }

  .summary {
    min-width: 20rem;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    @include mixins.mobile {
      width: 100%;
    }

    .stake-button {
      margin-top: var(--spacing-md);
    }
  }

  .info {
    flex-basis: 100%;
  }

  .stake {
    margin-top: var(--spacing-2xl);
    gap: var(--spacing-3xl);
    @include mixins.mobile {
      gap: var(--spacing-lg);
    }
    align-items: flex-start;
  }

  .heading-text {
    margin-bottom: var(--spacing-lg);
  }

  .heading-subtext {
    color: var(--theme-subtext);
  }
</style>
