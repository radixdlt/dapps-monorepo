<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import SidePanel from '@components/_base/side-panel/SidePanel.svelte'
  import CloseButton from '@components/_base/side-panel/CloseButton.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import InfoBox from './InfoBox.svelte'

  export let open: boolean
  export let stakeButtonDisabled = false

  let rightColumnWidth = '25rem'
</script>

<SidePanel bind:open>
  <div class="header">
    <CloseButton on:click={() => (open = false)} />
    <h3><slot name="title" /></h3>
    <div />
  </div>

  <Divider />

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
    <div class="stake-button" style:width={rightColumnWidth}>
      <ButtonNew size="big" disabled={stakeButtonDisabled}>
        <slot name="button-text" />
      </ButtonNew>
    </div>
  </div>
</SidePanel>

<style lang="scss">
  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: var(--spacing-lg);

    .align-left {
      text-align: left;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stake-button {
    flex-shrink: 0;
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
    color: var(--color-grey-2);
  }
</style>
