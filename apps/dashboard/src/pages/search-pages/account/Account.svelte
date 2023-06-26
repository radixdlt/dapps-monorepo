<script lang="ts">
  import PageHeader from '@components/_base/page-header/PageHeader.svelte'
  import { goto } from '$app/navigation'

  export let address: string | undefined
  export let activeTab: string

  const menuItems = [[{ id: 'tokens', label: 'Tokens' }]]
</script>

<div class="account-page">
  <PageHeader
    {menuItems}
    {activeTab}
    {address}
    onMenuClick={(id) => {
      goto(`/account/${address}/${id}`)
    }}>Account</PageHeader
  >

  <slot />
</div>

<style lang="scss">
  @use '../../../../../../packages/ui/src/mixins.scss';
  .account-page {
    margin: 0 1rem;
    container-type: inline-size;
    @include mixins.desktop {
      margin: 0 3rem;
    }
  }
</style>
