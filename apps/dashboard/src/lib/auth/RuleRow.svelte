<script lang="ts">
  import type { AccessRule } from '@api/utils/auth'
  import Accordion from '@components/_base/accordion/Accordion.svelte'
  import Row from '@components/info-box/Row.svelte'
  import ComplexAuthRule from './ComplexAuthRule.svelte'
  import type { TokenInfo } from './TokenInfo'

  export let accessRule: AccessRule
  export let accessRuleName: string
  export let tokenInfo: TokenInfo
</script>

{#if accessRule.type !== 'Protected'}
  <Row text={accessRuleName}>
    <div slot="right">
      {typeof accessRule === 'string' ? accessRule : accessRule.type}
      <!-- quickfix possibly owner should always have whole accessRule here  -->
    </div>
  </Row>
{:else}
  <Row>
    <div style:width="100%">
      <div class="accordion">
        <Accordion header={accessRuleName}>
          <svelte:fragment slot="content">
            <div class="accordion-content">
              <ComplexAuthRule rule={accessRule.access_rule} {tokenInfo} />
            </div>
          </svelte:fragment>
        </Accordion>
      </div>
    </div>
  </Row>
{/if}

<style lang="scss">
  .accordion {
    :global(.header-text) {
      font-size: var(--text-md);
      color: var(--color-grey-2);
      font-weight: var(--font-weight-bold-2);
      text-transform: uppercase;
      margin-bottom: 1rem;
      margin-right: 2rem;

      @include mixins.desktop {
        margin-bottom: 0;
      }
    }

    :global(.icon) {
      @include mixins.desktop {
        margin-right: 0;
      }
    }
  }

  .accordion-content {
    padding-top: var(--spacing-xl);

    :global(> div > .access-rule) {
      background-color: var(--color-grey-5);
    }
  }
</style>
