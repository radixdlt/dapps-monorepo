<script lang="ts">
  import ConnectButton from '../connect-button/ConnectButton.svelte'
  import NetworkLookupSearch from './NetworkLookupSearch.svelte'
  import MenuIcon from '@icons/menu.svg'
  import LogoIcon from '@images/dashboard-logo.svg'
  import { showSidebar } from '@stores'
  import { isMobile } from '@utils'
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
    <!-- svelte-ignore a11y-missing-content -->
    <a href="/" class="logo" style={`background-image: url(${LogoIcon})`} />
  </div>
  <div class="search"><NetworkLookupSearch /></div>
  {#if !isMobile()}
    <div class="connect-button"><ConnectButton /></div>
  {/if}
</header>

<style lang="scss">
  @use '../../mixins.scss';

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
      flex-direction: row;
      padding: 0 var(--spacing-lg);
    }
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

    .logo {
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      width: 10.125rem;
      height: 1.5rem;
      display: inline-flex;
      margin-left: var(--spacing-lg);
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
    width: 42.8125rem;
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
