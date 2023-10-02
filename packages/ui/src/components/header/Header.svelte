<script lang="ts">
  import '@radixdlt/dapps-dropdown'
  import ConnectButton from '../connect-button/ConnectButton.svelte'
  import NetworkLookupSearch from './NetworkLookupSearch.svelte'
  import MenuIcon from '@icons/menu.svg'

  import { isMobileDevice, showSidebar } from '@stores'
  import PageNavigation from './PageNavigation.svelte'
  import type { ComponentProps } from 'svelte'

  export let hideSearch: boolean | undefined
  export let showDesktopSidebar: boolean | undefined
  export let routes: ComponentProps<PageNavigation>['routes']
</script>

<header>
  <div class="logo-wrapper">
    <button
      on:click={() => {
        showSidebar.set(true)
      }}
      style={`background-image: url(${MenuIcon});`}
      class="mobile-menu"
    />
    <slot name="logo" />

    {#if !showDesktopSidebar}
      <div class="desktop-only">
        <PageNavigation {routes} />
      </div>
    {/if}

    <radix-dapps-dropdown class="mobile-only mobile-dapps-dropdown" />
  </div>
  {#if !hideSearch} <div class="search"><NetworkLookupSearch /></div> {/if}
  <div class="right-wrapper">
    <radix-dapps-dropdown class="desktop-only" />
    {#if !$isMobileDevice}
      <div class="connect-button"><ConnectButton /></div>
    {/if}
  </div>
</header>

<style lang="scss">
  @use '../../mixins.scss';

  .mobile-dapps-dropdown {
    justify-self: end;
  }

  header {
    background-color: var(--color-light);
    border-bottom: solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-width: 1px;
    border-color: var(--theme-border);
    z-index: 2;
    height: 100%;
    padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
    flex-direction: column;
    box-shadow: var(--shadow-sm);

    @include mixins.desktop {
      gap: var(--spacing-xl);
      flex-direction: row;
      padding: 0 var(--spacing-2xl) 0 var(--spacing-lg);
    }
  }

  .right-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
  }

  .logo-wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    @include mixins.desktop {
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button {
      flex: 0 0 auto;
    }
  }

  .mobile-menu {
    display: block;
    width: 2rem;
    height: 2rem;
    background-size: contain;
    border: none;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;
    @include mixins.desktop {
      display: none;
    }
  }

  .search {
    margin: 1rem 0;
    height: 2.5rem;
    width: 100%;
    max-width: 42.8125rem;
    display: flex;
    align-items: center;

    @include mixins.desktop {
    }
  }

  .connect-button {
    align-self: flex-end;
    @include mixins.desktop {
      align-self: center;
    }
  }
</style>
