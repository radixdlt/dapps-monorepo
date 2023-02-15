<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import InfoBox from './InfoBox.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Row from './Row.svelte'
</script>

<Meta title="InfoBox" />

<Story name="Primary">
  <InfoBox>
    <Row>
      <Text bold slot="left">status</Text>
      <Text slot="right">success</Text>
    </Row>
    <Row>
      <Text bold slot="left">from</Text>
      <Text slot="right">0x1234567890</Text>
    </Row>
    <Row>
      <Text bold slot="left">to</Text>
      <Text slot="right">0x1234567890</Text>
    </Row>
  </InfoBox>
</Story>
