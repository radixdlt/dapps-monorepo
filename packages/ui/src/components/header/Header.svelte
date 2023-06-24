<script lang="ts">
  import ConnectButton from '../connect-button/ConnectButton.svelte'
  import NetworkLookupSearch from './NetworkLookupSearch.svelte'
  import { isMobile } from '@utils'
  import MenuIcon from '@icons/menu.svg'
  import LogoIcon from '@images/dashboard_logo.svg'
</script>

<header>
  <div class="logo-wrapper">
    <button
      on:click
      style={`background-image: url(${MenuIcon});`}
      class="mobile-menu"
    />
    <!-- svelte-ignore a11y-missing-content -->
    <a href="/" class="logo" style={`background-image: url(${LogoIcon});`} />
  </div>
  <div class="search"><NetworkLookupSearch /></div>
  {#if !isMobile()}
    <div class="connect-button"><ConnectButton /></div>
  {/if}
</header>

<style lang="scss">
  @use '../../mixins.scss';

  header {
    padding: var(--spacing-xl);
    background-color: var(--color-light);
    position: sticky;
    top: 0;
    border-bottom: solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-width: 1px;
    border-color: var(--theme-border);
    grid-area: header;
    z-index: 2;
    padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
    flex-direction: column;

    @include mixins.desktop {
      flex-direction: row;
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
      background-position: center;
      width: 216px;
      height: 32px;
      display: inline-flex;
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
    width: 100%;
    @include mixins.desktop {
      flex: 0.8;
    }
  }

  .connect-button {
    align-self: flex-end;
    @include mixins.desktop {
      align-self: center;
    }
  }
</style>
