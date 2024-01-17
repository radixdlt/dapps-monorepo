<script lang="ts" context="module">
  type ItemBase = {
    key: string
    label: string
    placeholder: string
    formItemType: string
    showCondition?: (formState: Record<string, string>) => boolean
    schema?: ZodSchema
    metadata?: Record<string, string>
    transformValue?: (value: string) => any
    error?: boolean
  }

  type TextareaFormItem = ItemBase & {
    formItemType: 'textarea'
    rows: number
  }

  type TextareaWithCheckboxFormItem = ItemBase & {
    formItemType: 'textareaWithCheckbox'
    checkboxKey: string
    checkboxLabel: string
    rows: number
  }

  type InputFormItem = ItemBase & {
    formItemType: 'input'
  }

  type InputWithCheckboxFormItem = ItemBase & {
    formItemType: 'inputWithCheckbox'
    checkboxKey: string
    checkboxLabel: string
  }

  type SelectFormItem = ItemBase & {
    formItemType: 'select'
    items: { id: string; label: string }[]
  }

  export type FormItem =
    | TextareaFormItem
    | TextareaWithCheckboxFormItem
    | InputFormItem
    | InputWithCheckboxFormItem
    | SelectFormItem
</script>

<script lang="ts">
  import Select from '../select/Select.svelte'
  import Input from '../input/Input.svelte'
  import Textarea from '../Textarea.svelte'
  import Label from '../Label.svelte'
  import type { ZodSchema, z } from '@common/utils/zod'
  import { writable } from 'svelte/store'
  import Checkbox from '@svelte-ui/components/_base/checkbox/Checkbox.svelte'

  export let items: FormItem[] = []
  export let state = writable<Record<string, string>>({})
  export let disabled = false

  const checkboxValue = (key: string) => $state[key] === 'true'
  const handleCheckboxChange = (item: FormItem, value: boolean) => {
    if (
      item.formItemType === 'inputWithCheckbox' ||
      item.formItemType === 'textareaWithCheckbox'
    )
      $state[item.checkboxKey] = value ? 'false' : 'true'
  }
</script>

{#each items as item}
  {#if item.showCondition && !item.showCondition($state)}{''}{:else}
    <div class="form-item">
      <Label {disabled}>{item.label}</Label>
      {#if item.formItemType === 'input'}
        <Input
          {disabled}
          placeholder={item.placeholder}
          bind:value={$state[item.key]}
          schema={item.schema}
        />
      {:else if item.formItemType === 'inputWithCheckbox'}
        <div class="with-checkbox">
          <div class="input">
            <Input
              {disabled}
              placeholder={item.placeholder}
              bind:value={$state[item.key]}
              schema={item.schema}
            />
          </div>
          <Checkbox
            checked={checkboxValue(item.checkboxKey)}
            {disabled}
            on:checked={() => handleCheckboxChange(item, true)}
            on:unchecked={() => handleCheckboxChange(item, false)}
            >{item.checkboxLabel}</Checkbox
          >
        </div>
      {:else if item.formItemType === 'textarea'}
        <Textarea
          {disabled}
          placeholder={item.placeholder}
          bind:value={$state[item.key]}
          schema={item.schema}
          rows={item.rows}
        />
      {:else if item.formItemType === 'textareaWithCheckbox'}
        <div class="with-checkbox">
          <Textarea
            {disabled}
            placeholder={item.placeholder}
            bind:value={$state[item.key]}
            schema={item.schema}
            rows={item.rows}
          />
          <Checkbox
            {disabled}
            checked={checkboxValue(item.checkboxKey)}
            on:checked={() => handleCheckboxChange(item, true)}
            on:unchecked={() => handleCheckboxChange(item, false)}
            >{item.checkboxLabel}</Checkbox
          >
        </div>
      {:else if item.formItemType === 'select'}
        <Select
          {disabled}
          placeholder={item.placeholder}
          bind:selected={$state[item.key]}
          items={item.items}
        />
      {/if}
    </div>
  {/if}
{/each}

<style lang="scss">
  .form-item {
    margin-bottom: 1rem;
  }

  .with-checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .input {
    width: 100%;
  }
</style>
