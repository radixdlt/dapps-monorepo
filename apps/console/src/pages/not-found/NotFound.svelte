<div class="box">
  <div class="header">No results found</div>

  <div class="subtext">
    Sorry, but it seems that no results were found for your search. Try a new
    search.
  </div>
</div>

<style lang="scss">
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-top: 50px;

    @include mixins.desktop {
      gap: 1rem;
      margin-top: 200px;
    }
  }

  .header {
    color: var(--theme-text-primary);
    font-size: 1.125rem;
    font-weight: var(--font-weight-bold-2);

    @include mixins.desktop {
      font-size: 2.25rem;
    }
  }

  .subtext {
    color: var(--theme-subtext);
    font-size: 1rem;
    text-align: center;
    font-weight: var(--font-weight-bold-1);
    line-height: 30px;

    @include mixins.desktop {
      max-width: 470px;
    }
  }
</style>
