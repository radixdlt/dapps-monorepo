<script>
  import Divider from '@components/_base/divider/Divider.svelte'
</script>

<footer>
  <Divider />

  <div class="footer">
    <a href="https://www.radixdlt.com/privacy-policy" target="_blank"
      >Privacy Notice</a
    >|
    <a href="http://www.radixdlt.com/terms/dashboardEULA"
      >Terms and Conditions</a
    >
  </div>
</footer>

<style>
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
  }
</style>
