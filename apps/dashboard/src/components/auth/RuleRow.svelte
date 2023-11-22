<script lang="ts">
  import type { AccessRule } from '@api/utils/auth'
  import Accordion from '@components/_base/accordion/Accordion.svelte'
  import Row from '@components/info-box/Row.svelte'

  export let accessRule: AccessRule
  export let accessRuleName: string
</script>

{#if accessRule.type !== 'Protected'}
  <Row text={accessRuleName}>
    <div slot="right">
      {accessRule.type}
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
