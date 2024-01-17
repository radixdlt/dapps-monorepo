<script lang="ts">
  import type { AccessRule } from '@common/api/_deprecated/utils/auth'
  import Accordion from '@svelte-ui/components/_base/accordion/Accordion.svelte'
  import Row from '@svelte-ui/components/info-box/Row.svelte'

  export let accessRule: AccessRule
  export let accessRuleName: string
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
              <!--
                    <ComplexAuthRule
                      rule={entry[1].rule.access_rule}
                      {tokenInfo}
                    />
                  -->
              <pre>{JSON.stringify(accessRule.access_rule, null, 2)}</pre>
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
  }

  .accordion-content {
    margin-top: var(--spacing-lg);
  }
</style>
