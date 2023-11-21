<script lang="ts" context="module">
  export type NftData = {
    name: string
    description: string
    key_image_url: string
  }
</script>

<script lang="ts">
  import { writable } from 'svelte/store'
  import Form, { type FormItem } from './Form.svelte'
  import { createEventDispatcher } from 'svelte'
  import { string } from 'zod'

  export let state = writable<NftData>({
    name: '',
    description: '',
    key_image_url: ''
  })

  const dispatch = createEventDispatcher<{
    change: { data: NftData; isValid: boolean }
  }>()

  const formItems: FormItem[] = [
    {
      key: 'name',
      label: 'Name',
      placeholder: 'Enter NFT name (truncated after 32 characters)',
      formItemType: 'input',
      schema: string().min(1, { message: 'name required' })
    },
    {
      key: 'description',
      label: 'Description',
      placeholder: 'Enter NFT description (truncated after 256 characters)',
      formItemType: 'textarea',
      rows: 2,
      schema: string().min(1, { message: 'description required' })
    },
    {
      key: 'key_image_url',
      label: 'Image URL',
      placeholder: 'Enter secure NFT image URL (https)',
      formItemType: 'input',
      schema: string()
        .min(1, { message: 'image URL required' })
        .startsWith('https://', {
          message: 'must provide secure URL (https://)'
        })
    }
  ]

  $: {
    const values = $state
    const isInvalid = formItems.some((item) => {
      const value = values[item.key as keyof NftData]
      const invalid = item.schema!.safeParse(value).success === false
      return invalid
    })
    dispatch('change', {
      data: $state,
      isValid: !isInvalid
    })
  }
</script>

<div>
  <Form items={formItems} {state} />
</div>

<style lang="scss"></style>
