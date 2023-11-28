<script lang="ts" context="module">
  export type NftData = {
    name: string
    description: string
    key_image_url: string
  }
</script>

<script lang="ts">
  import { writable } from 'svelte/store'
  import Form, { type FormItem } from '../../../components/Form.svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import { string } from 'zod'

  export let defaultState: NftData = {
    name: '',
    description: '',
    key_image_url: ''
  }

  export let state = writable<NftData>({
    name: '',
    description: '',
    key_image_url: ''
  })
  export let disabled = false

  onMount(() => {
    $state = defaultState
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
      rows: 2
    },
    {
      key: 'key_image_url',
      label: 'Key image URL',
      placeholder: 'Enter key image URL',
      formItemType: 'input'
    }
  ]

  $: {
    const values = $state
    const isInvalid = formItems.some((item) => {
      const value = values[item.key as keyof NftData]
      const invalid = item.schema
        ? item.schema.safeParse(value).success === false
        : false
      return invalid
    })
    dispatch('change', {
      data: $state,
      isValid: !isInvalid
    })
  }
</script>

<Form items={formItems} {state} {disabled} />
