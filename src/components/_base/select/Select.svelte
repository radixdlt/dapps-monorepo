<script lang="ts">
  import type { VariantProps } from '@stitches/core'
  import { config, css } from '@styles'

  export let height: `$${keyof typeof config['theme']['sizes']}` | undefined =
    undefined
  export let width: `$${keyof typeof config['theme']['sizes']}` | undefined =
    undefined
  export let size: VariantProps<typeof style>['size'] | undefined = undefined

  export let onChange:
    | ((e: Event & { currentTarget: EventTarget & HTMLSelectElement }) => void)
    | undefined = undefined

  export let visible = true

  $: style = css({
    backgroundColor: '$pickerBackground',
    color: '$onPickerBackground',
    marginRight: '$sm',
    visibility: visible ? 'visible' : 'hidden',
    variants: {
      size: {
        small: {
          height: '$sm',
          width: 'calc($sm * 4)'
        },
        medium: {
          height: '$md',
          width: 'calc($md * 4)'
        },
        large: {
          height: '$lg',
          width: 'calc($lg * 4)'
        }
      }
    }
  })
</script>

<select class={style({ css: { height, width }, size })} on:change={onChange}>
  <slot />
</select>
