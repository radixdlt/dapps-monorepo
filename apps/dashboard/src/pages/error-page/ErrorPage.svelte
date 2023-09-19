<script lang="ts">
  export let status: 400 | 404

  const errorMessages = {
    400: {
      title: 'Bad Request',
      description: 'That address was not valid.'
    },
    404: {
      title: 'Not Found',
      description: 'The requested entity could not be found.'
    }
  }

  $: title = errorMessages[status]?.title || 'Oops!'

  $: description = errorMessages[status]?.description || 'An error occured.'
</script>

<div class="box">
  <div class="header">{title}</div>

  <div class="subtext">
    {description}
  </div>
</div>

<style lang="scss">
  @use '../../../../../packages/ui/src/mixins.scss';

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
