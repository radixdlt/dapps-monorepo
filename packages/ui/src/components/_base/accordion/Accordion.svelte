<script lang="ts">
  import IconNew from '../icon/IconNew.svelte'
  import { slide } from 'svelte/transition'
  import PickerExpand from '@icons/picker-expand.svg'
  export let isOpened = false
  export let header = ''
  const toggleContent = (event: MouseEvent) => {
    isOpened = !isOpened
  }
</script>

<div class="accordion">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="header-wrapper" on:click={(event) => toggleContent(event)}>
    <slot name="header">
      <div class="header-text">{header}</div>
    </slot>

    <div class="subheader-icon">
      <div class="subheader"><slot name="subheader" /></div>

      <div class="icon" style:transform={`rotate(${isOpened ? '180deg' : 0})`}>
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
  @use '../../../mixins.scss';
  .accordion {
    border-top: 1px solid var(--color-grey-3);

    &:last-child {
      border-bottom: 1px solid var(--color-grey-3);
    }
  }

  .icon {
    transition: transform 0.3s ease-in-out;

    @include mixins.desktop {
      margin-right: 2rem;
      margin-left: 0.25rem;
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
    height: 130px;

    @include mixins.desktop {
      height: 112px;
    }
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    :global(.header-text) {
      font-size: 1.2rem;
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

  .content {
    padding-bottom: 1rem;
  }
</style>
