<script lang="ts">
  import { page } from '$app/stores'
  import { isSameRoute } from '@utils'

  export let routes: {
    text: string
    path: string
  }[]

  $: activeTab = routes.find((route) =>
    isSameRoute(route.path, $page.url.pathname ?? '')
  )?.path
</script>

<div class="page-navigation">
  {#each routes as route}
    <div class="link-box" class:active={activeTab === route.path}>
      <a class="link dotted-overflow" id={route.text} href={route.path}
        >{route.text}</a
      >
    </div>
  {/each}
</div>

<style lang="scss">
  .page-navigation {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--spacing-2xl);
    height: 100%;
  }

  .link-box {
    transition: background-color 0.2s ease-in-out;

    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-md);
    &:hover {
      background-color: var(--color-grey-4);
    }
  }

  .link {
    font-weight: var(--font-weight-bold-2);
    color: var(--color-grey-1);
  }

  .active {
    background-color: var(--color-grey-4);
  }
</style>
