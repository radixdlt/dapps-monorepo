<script lang="ts">
  export let text: string = ''
  export let modifiers: string = ''
</script>

<div class="row {modifiers}">
  <slot>
    <slot name="left">
      <span class="label">{text}</span>
    </slot>
    <slot name="right" />
  </slot>
</div>

<style lang="scss">
  .label {
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
    text-transform: uppercase;
    margin-bottom: 1rem;
    margin-right: 2rem;

    @include mixins.desktop {
      margin-bottom: 0;
    }
  }

  .row {
    display: flex;
    flex-direction: column;

    padding: 1rem 0;
    border-bottom: 1px solid var(--color-grey-4);

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    @include mixins.desktop {
      padding: 0.75rem 0;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    &.no-capitalize {
      .label {
        text-transform: none;
      }
    }
  }

  .label-full {
    flex-wrap: wrap;
    .label {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
</style>
