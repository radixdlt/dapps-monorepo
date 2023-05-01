<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'

  export let mode: 'ascending' | 'descending' | 'unsorted'
</script>

<div
  id="sort-icons"
  class:ascending={mode === 'ascending'}
  class:descending={mode === 'descending'}
>
  <div id="down">
    <Icon type="descending" size="small" />
  </div>
  <div id="up">
    <Icon type="ascending" size="small" />
  </div>
</div>

<style lang="scss">
  #sort-icons {
    display: flex;

    #up,
    #down {
      opacity: 0.5;
      transition: opacity 0.1s ease-in-out;
    }
    #up {
      translate: -5px 0;
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
