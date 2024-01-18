<script lang="ts" context="module">
  type ItemBase = {
    key: string
    label?: string
    placeholder?: string
    formItemType: string
    showCondition?: (formState: Record<string, any>) => boolean
    schema?: ZodSchema
    metadata?: Record<string, string>
    transformValue?: (value: any) => any
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
    startDecorator?: new (...args: any[]) => SvelteComponent
    startDecoratorPropertiesFn?: () => Record<string, any>
  }

  type SvelteComponentFormItem = ItemBase & {
    formItemType: 'svelteComponent'
    component: new (...args: any[]) => SvelteComponent
    componentProperties?: Record<
      string,
      string | number | boolean | Record<string, any>
    >
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

  type ListFormItem = ItemBase & {
    formItemType: 'list'
    addLabel?: string
    startDecorator?: new (...args: any[]) => SvelteComponent
    startDecoratorPropertiesFn?: () => Record<string, any>
  }

  export type FormItem =
    | TextareaFormItem
    | TextareaWithCheckboxFormItem
    | InputFormItem
    | InputWithCheckboxFormItem
    | SelectFormItem
    | ListFormItem
    | SvelteComponentFormItem
</script>

<script lang="ts">
  import Select from '../select/Select.svelte'
  import Input from '../input/Input.svelte'
  import Textarea from '../Textarea.svelte'
  import Label from '../Label.svelte'
  import type { ZodSchema, z } from '@common/zod'
  import { writable, type Writable } from 'svelte/store'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import type { SvelteComponent } from 'svelte'
  import PadlockIcon from '@icons/validators-menu.svg'
  import IconNew from '@components/_base/icon/IconNew.svelte'

  export let items: FormItem[] = []
  export let state = writable<Record<string, any>>({})
  export let disabled = false
  export let disabledFields: Record<string, any> = {}
  export let initialState: Writable<Record<string, any>> | undefined = undefined
  export let showPadLockWhenDisabled = false

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
      {#if item.label}<Label {disabled}
          >{item.label}{#if showPadLockWhenDisabled && disabledFields[item.key]}
            <IconNew icon={PadlockIcon} />{/if}</Label
        >{/if}
      {#if item.formItemType === 'input'}
        <div class="with-action">
          {#if item.startDecorator}
            <svelte:component
              this={item.startDecorator}
              value={$state[item.key]}
              {...item.startDecoratorPropertiesFn?.()}
            />
          {/if}
          <Input
            disabled={disabled || disabledFields[item.key]}
            placeholder={item.placeholder}
            bind:value={$state[item.key]}
            schema={item.schema}
          />
        </div>
      {:else if item.formItemType === 'inputWithCheckbox'}
        <div class="with-action">
          <div class="input">
            <Input
              disabled={disabled || disabledFields[item.key]}
              placeholder={item.placeholder}
              bind:value={$state[item.key]}
              schema={item.schema}
            />
          </div>
          <Checkbox
            checked={checkboxValue(item.checkboxKey)}
            disabled={disabled || disabledFields[item.key]}
            on:checked={() => handleCheckboxChange(item, true)}
            on:unchecked={() => handleCheckboxChange(item, false)}
            >{item.checkboxLabel}</Checkbox
          >
        </div>
      {:else if item.formItemType === 'textarea'}
        <Textarea
          disabled={disabled || disabledFields[item.key]}
          placeholder={item.placeholder}
          bind:value={$state[item.key]}
          schema={item.schema}
          rows={item.rows}
        />
      {:else if item.formItemType === 'svelteComponent'}
        <svelte:component
          this={item.component}
          {...item.componentProperties || {}}
        />
      {:else if item.formItemType === 'textareaWithCheckbox'}
        <div class="with-action">
          <Textarea
            disabled={disabled || disabledFields[item.key]}
            placeholder={item.placeholder}
            bind:value={$state[item.key]}
            schema={item.schema}
            rows={item.rows}
          />
          <Checkbox
            disabled={disabled || disabledFields[item.key]}
            checked={checkboxValue(item.checkboxKey)}
            on:checked={() => handleCheckboxChange(item, true)}
            on:unchecked={() => handleCheckboxChange(item, false)}
            >{item.checkboxLabel}</Checkbox
          >
        </div>
      {:else if item.formItemType === 'select'}
        <Select
          disabled={disabled || disabledFields[item.key]}
          placeholder={item.placeholder}
          bind:selected={$state[item.key]}
          items={item.items}
        />
      {:else if item.formItemType === 'list'}
        {#if !disabledFields[item.key]}
          <button
            class="add-button"
            class:disabled={disabled || disabledFields[item.key]}
            on:click={() => ($state[item.key] = [...$state[item.key], ''])}
            >{item.addLabel || 'Add'}</button
          >
        {/if}
        {#each $state[item.key] as listItem, index}
          <div style:margin-bottom="1rem" class="with-action">
            <div class="with-action input">
              {#if item.startDecorator}
                <svelte:component
                  this={item.startDecorator}
                  value={listItem}
                  {...item.startDecoratorPropertiesFn?.()}
                />
              {/if}
              <Input
                disabled={disabled || disabledFields[item.key]}
                placeholder={item.placeholder}
                schema={item.schema}
                bind:value={listItem}
              />
            </div>

            {#if !disabledFields[item.key]}
              <button
                class:disabled={disabled || disabledFields[item.key]}
                on:click={() =>
                  ($state[item.key] = $state[item.key].toSpliced(index, 1))}
                >Remove</button
              >
            {/if}
          </div>
        {/each}
      {/if}
      {#if initialState && $initialState}
        {#if JSON.stringify($initialState[item.key]) !== JSON.stringify($state[item.key])}
          <div class="restore-original-value">
            Value of "{item.label}" field has changed.
            <button
              class="restore-button"
              on:click={() => {
                $state[item.key] = $initialState?.[item.key]
              }}>Restore to original value</button
            >
          </div>
        {/if}
      {/if}
    </div>
  {/if}
{/each}

<style lang="scss">
  .restore-button {
    text-decoration: underline;
    margin-top: 0.5rem;
  }

  .form-item {
    margin-bottom: 1rem;
    position: relative;
  }

  .with-action {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .input {
    width: 100%;
  }

  .label {
    font-weight: 500;
    margin-bottom: 0.75rem;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .add-button {
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
