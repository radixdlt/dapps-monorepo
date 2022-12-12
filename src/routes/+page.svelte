<script lang="ts">
  import { featureFlags } from '../feature-flags'
</script>

<svelte:head>
  {#if featureFlags().getFlag('cookie-banner')?.enabled}
    <!-- OneTrust Cookies Consent Notice start for betanet-dashboard.radixdlt.com -->
    <script
      src="https://cdn-ukwest.onetrust.com/scripttemplates/otSDKStub.js"
      type="text/javascript"
      charset="UTF-8"
      data-domain-script="de2483c5-9867-4af6-9434-dfc97b731f0c"
    ></script>
    <script type="text/javascript">
      function OptanonWrapper() {}
    </script>
    <!-- OneTrust Cookies Consent Notice end for betanet-dashboard.radixdlt.com -->
  {/if}
</svelte:head>
