<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import TokenIcon from './TokenIcon.svelte'
  const tokens = [
    {
      icon: 'brokenImg'
    },
    {
      icon: 'https://picsum.photos/1000/500'
    },
    {
      icon: 'https://picsum.photos/10'
    },
    {},
    {
      icon: 'https://picsum.photos/10/20'
    },
    {
      icon: 'https://picsum.photos/44'
    }
  ]
</script>

<Meta title="TokenIcon" />

<Template>
  {#each tokens as token, index}
    <div style:margin-bottom="10px">
      <TokenIcon iconUrl={`${token.icon}?${index}`} />
    </div>
  {/each}
</Template>

<Story name="Primary" />
