<script>
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakingIcon from '@icons/staking.svg'
</script>

<div id="icon">
  <div>
    <div id="main-icon">
      <IconNew icon={StakingIcon} size="large" />
    </div>
    <div class="secondary-icon-1">
      <IconNew icon={StakingIcon} size="large" />
    </div>
    <div class="secondary-icon-2">
      <IconNew icon={StakingIcon} size="large" />
    </div>
  </div>
</div>

<style lang="scss">
  #icon {
    position: relative;
    #main-icon {
      position: relative;
      z-index: 1;
    }
    .secondary-icon-1,
    .secondary-icon-2 {
      position: absolute;
      z-index: 0;
    }

    .secondary-icon-1 {
      translate: -1rem -3.5rem;
      opacity: 0.3;
    }
    .secondary-icon-2 {
      translate: 1rem -3.5rem;
      opacity: 0.6;
    }
  }
</style>
