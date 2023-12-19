<script lang="ts">
  let customClassName = ''
  let Wrapper: any = null
  export let count = 1
  export let duration = 1.2
  export let width = null
  export { Wrapper as wrapper }
  export let height = null
  export let circle = false
  export { customClassName as class }
  export const defaultBaseColor = '#eee'
  export const defaultHighlightColor = '#f5f5f5'
  const elements: any = []
  for (let i = 0; i < count; i++) {
    let style: any = {}
    if (width !== null) {
      style.width = `${width}px`
    }
    if (height !== null) {
      style.height = `${height}px`
    }
    if (width !== null && height !== null && circle) {
      style.borderRadius = '50%'
    }
    let className = 'svelte-loader-skeleton'
    if (customClassName) {
      className += ' ' + customClassName
    }
    elements.push({
      className: className,
      style
    })
  }
</script>

<div
  style="
            --defaultBaseColor: {defaultBaseColor};
            --defaultHighlightColor: {defaultHighlightColor};
            --duration: {duration}s;
        "
>
  {#if Wrapper}
    {#each elements as element}
      <span>
        <svelte:component this={Wrapper}>
          <span
            class={element.className}
            style="width:{element.style.width}; border-radius:{element.style
              .borderRadius}; height:{element.style.height}"
          >
            &zwnj;
          </span>
        </svelte:component>
      </span>
    {/each}
  {:else}
    {#each elements as element}
      <span
        class={element.className}
        style="width:{element.style.width}; border-radius:{element.style
          .borderRadius}; height:{element.style.height}"
      >
        &zwnj;
      </span>
    {/each}
  {/if}
</div>

<style>
  @keyframes slide {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  .svelte-loader-skeleton {
    background-color: var(--defaultBaseColor);
    background-image: linear-gradient(
      90deg,
      var(--defaultBaseColor),
      var(--defaultHighlightColor),
      var(--defaultBaseColor)
    );
    background-size: 200px 100%;
    background-repeat: no-repeat;
    border-radius: 4px;
    display: inline-block;
    line-height: 1;
    width: 100%;
    animation: slide var(--duration) ease-in-out infinite;
  }
</style>
