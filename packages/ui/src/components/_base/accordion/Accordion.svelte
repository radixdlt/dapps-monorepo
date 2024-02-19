<script lang="ts">
  import IconNew from '../icon/IconNew.svelte'
  import { slide } from 'svelte/transition'
  import PickerExpand from '@icons/picker-expand.svg'
  export let isOpened = false
  export let header = ''

  export const toggleContent = () => {
    isOpened = !isOpened
  }
</script>

<div class="accordion">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="header-wrapper" on:click={toggleContent}>
    <slot name="header">
      <div class="header-text">{header}</div>
    </slot>

    <div class="subheader-icon">
      <div class="subheader"><slot name="subheader" /></div>

      <div class="icon" style:transform={`rotate(${isOpened ? 0 : '180deg'})`}>
        <IconNew icon={PickerExpand} size="small" />
      </div>
    </div>
  </div>
  {#if isOpened}
    <div class="content" transition:slide>
      <slot name="content" />
    </div>
  {/if}
</div>

<style lang="scss">
  .icon {
    transition: transform 0.3s ease-in-out;

    @include mixins.desktop {
      margin-left: 0.5rem;
    }
  }

  .subheader-icon {
    display: flex;
    align-items: center;

    @include mixins.mobile {
      flex-direction: column-reverse;
      position: absolute;
      align-items: flex-end;
      top: 1.5rem;
      right: 0;

      .subheader {
        transform: translateY(10px);
      }
    }
  }

  .header-wrapper {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    :global(.header-text) {
      font-size: var(--text-lg);
      white-space: nowrap;
      font-weight: var(--font-weight-bold-2);
    }

    .subheader {
      color: var(--color-grey-2);
      font-size: 1rem;
      white-space: nowrap;
      font-weight: var(--font-weight-bold-1);
    }
  }
</style>
