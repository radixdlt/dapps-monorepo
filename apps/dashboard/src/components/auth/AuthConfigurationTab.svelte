<script lang="ts">
  import type { AuthInfo } from '@api/utils/auth'
  import Accordion from '@components/_base/accordion/Accordion.svelte'
  import Row from '@components/info-box/Row.svelte'
  import type { FungibleResource } from '@api/utils/entities/resource'
  import type { NonFungible } from '@api/utils/nfts'

  export let auth: AuthInfo
  export let tokenInfo: {
    fungibles: Promise<FungibleResource[]>
    nonFungibles: Promise<NonFungible[]>
  }
  export let hideRules: Set<string> = new Set()
</script>

<div class="card">
  {#each Object.entries(auth.rules).filter((entry) => !hideRules.has(entry[0])) as entry}
    {#if entry[1].rule.type !== 'Protected'}
      <Row text={entry[0]}>
        <div slot="right">
          {entry[1].rule.type}
        </div>
      </Row>
    {:else}
      <Row>
        <div style:width="100%">
          <div class="accordion">
            <Accordion header={entry[0]}>
              <svelte:fragment slot="content">
                <div class="accordion-content">
                  <!--
                    <ComplexAuthRule
                      rule={entry[1].rule.access_rule}
                      {tokenInfo}
                    />
                  -->
                  <pre>
                    {JSON.stringify(entry[1].rule.access_rule, null, 2)}
                    </pre>
                </div>
              </svelte:fragment>
            </Accordion>
          </div>
        </div>
      </Row>
    {/if}
  {/each}
</div>

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
