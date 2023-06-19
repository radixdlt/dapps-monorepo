<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'
  import DescendingIcon from '@icons/descending.svg'
  import AscendingIcon from '@icons/ascending.svg'

  export let mode: 'ascending' | 'descending' | 'unsorted'
</script>

<div
  id="sort-icons"
  class:ascending={mode === 'ascending'}
  class:descending={mode === 'descending'}
>
  <div id="down">
    <Icon icon={DescendingIcon} size="small" />
  </div>
  <div id="up">
    <Icon icon={AscendingIcon} size="small" />
  </div>
</div>

<style lang="scss">
  #sort-icons {
    display: flex;
    z-index: -1;

    #up,
    #down {
      opacity: 0.5;
      transition: opacity 0.1s ease-in-out;
    }
    #up {
      translate: -5px;
    }
  }

  .ascending {
    #up {
      opacity: 1 !important;
    }
  }

  .descending {
    #down {
      opacity: 1 !important;
    }
  }
</style>
