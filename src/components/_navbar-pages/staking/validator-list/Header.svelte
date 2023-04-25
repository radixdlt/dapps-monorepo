<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
</script>

<div id="column-headers">
  <div />
  <div style:justify-self="start">VALIDATOR</div>
  <div>ADDRESS</div>
  <div class="sortable" on:click={() => dispatch('sort-total-stake')}>
    TOTAL STAKE
    <Icon type="downArrow" size="small" />
  </div>
  <div class="sortable" on:click={() => dispatch('sort-owner-stake')}>
    OWNER STAKE (%)
    <Icon type="downArrow" size="small" />
  </div>
  <div id="apy-header">
    <div class="sortable" on:click={() => dispatch('sort-apy')}>
      APY <Icon type="downArrow" size="small" />
    </div>
    <div class="sortable" on:click={() => dispatch('sort-fee')}>
      FEE <Icon type="downArrow" size="small" />
    </div>
    <div class="sortable" on:click={() => dispatch('sort-uptime')}>
      UPTIME <Icon type="downArrow" size="small" />
    </div>
  </div>
  <div>ACCEPTS STAKE</div>
</div>

<style lang="scss">
  @use '../validator-card/shared.scss';

  #column-headers {
    @include shared.validator-card-grid;
    justify-items: center;

    div {
      color: var(--color-grey-2);
      font-weight: var(--font-weight-bold-2);
    }

    #apy-header {
      @include shared.apy-box-grid;
      justify-items: center;
    }
  }

  .sortable {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
</style>
