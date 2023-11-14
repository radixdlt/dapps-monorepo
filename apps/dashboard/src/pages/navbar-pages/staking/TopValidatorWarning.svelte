<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { PERCENTAGE_TOTAL_STAKE_WARNING } from '@constants'
  import WarningIcon from '@icons/warning.svg'
</script>

<div class="top-percent-warning full-width">
  <div>
    <div class="warning-text">
      <IconNew icon={WarningIcon} />
      <span class="bold">
        This validator has more than {PERCENTAGE_TOTAL_STAKE_WARNING}% total
        stake
      </span>
      <div>
        <span>We recommend to stake with</span>
        <span style:text-decoration="underline"
          >validators below {PERCENTAGE_TOTAL_STAKE_WARNING}% total stake</span
        >
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .top-percent-warning {
    border: var(--border) var(--color-alert-2);

    * {
      color: var(--color-alert-1);
    }
    padding: var(--spacing-lg) var(--spacing-2xl);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    background: #fffcf5;
    border-top: none;
  }

  .warning-text {
    display: flex;
    gap: var(--spacing-lg);
  }
</style>
