<script lang="ts">
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import InfoBox from './InfoBox.svelte'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'
  import { TransactionStatus } from '@radixdlt/babylon-gateway-api-sdk'
  import { _dependency } from '../../../../routes/(navbar-pages)/network-staking/+layout'
  import SidePanelHeader from '@components/_base/side-panel/SidePanelHeader.svelte'
  import { createEventDispatcher } from 'svelte'

  export let sidePanelHeader: string
  export let stakeButtonDisabled = false
  export let useBackdrop = false

  const dispatch = createEventDispatcher<{
    close: null | 'invalidate'
  }>()

  let rightColumnWidth = '15rem'
</script>

<SidePanel {useBackdrop} on:close>
  <SidePanelHeader
    text={sidePanelHeader}
    on:closeClick={() => dispatch('close')}
  />

  <div class="flex">
    <div />
    <slot name="account-picker" {rightColumnWidth} />
  </div>

  <div
    class="heading-text flex"
    style:margin-top={`${
      $$slots['account-picker'] ? 'var(--spacing-2xl)' : ''
    }`}
  >
    <h4><slot name="heading-text" /></h4>
    <div class="align-left heading-subtext" style:width={rightColumnWidth}>
      <slot name="heading-subtext" />
    </div>
  </div>

  <slot name="content" {rightColumnWidth} />

  <div class="stake flex">
    <div class="info">
      <InfoBox link={{ href: '', text: 'Learn more' }}>
        <slot name="info-box-title" slot="title" />
        <slot name="info-box-explanation" slot="explanation" />
      </InfoBox>
    </div>
    <div class="summary" style:width={rightColumnWidth}>
      <slot name="summary" />
      <div class="stake-button">
        <SendTxButton
          on:click
          on:response={(e) => {
            if (e.detail.status === TransactionStatus.CommittedSuccess) {
              dispatch('close', 'invalidate')
            }
          }}
          buttonProps={{ size: 'big', disabled: stakeButtonDisabled }}
        >
          <slot name="button-text" />
        </SendTxButton>
      </div>
    </div>
  </div>
</SidePanel>

<style lang="scss">
  @use '../../../../../../../packages/ui/src/mixins.scss';

  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: var(--spacing-lg);

    .align-left {
      text-align: left;
    }
  }

  .summary {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    .stake-button {
      margin-top: auto;
    }
  }

  .info {
    flex-basis: 100%;
  }

  .stake {
    margin-top: var(--spacing-2xl);
    gap: var(--spacing-3xl);
  }

  .heading-text {
    margin-bottom: var(--spacing-lg);
  }

  .heading-subtext {
    color: var(--theme-subtext);
  }
</style>
