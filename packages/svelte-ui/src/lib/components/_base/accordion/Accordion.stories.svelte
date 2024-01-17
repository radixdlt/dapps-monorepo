<script lang="ts" context="module">
	import { Story } from '@storybook/addon-svelte-csf';

	export const meta = {};
</script>

<script lang="ts">
	import Accordion from './Accordion.svelte';
	import NFTAccordion from './NFTAccordion.svelte';
	import FungibleTokenAccordion from './FungibleTokenAccordion.svelte';
</script>

<Story name="Simple">
	<Accordion>
		<svelte:fragment slot="header">
			<div>Header</div>
		</svelte:fragment>
		<svelte:fragment slot="content">
			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
				been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
				galley of type and scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
				It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
				passages, and more recently with desktop publishing software like Aldus PageMaker including
				versions of Lorem Ipsum
			</p>
		</svelte:fragment>
	</Accordion>
</Story>

<Story name="With Header Text">
	<Accordion header="Pool Units">
		<svelte:fragment slot="content">
			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum ha
			</p>
		</svelte:fragment>
	</Accordion>
</Story>

<Story name="Fungible Token Accordion">
	<FungibleTokenAccordion header="Radix Network XRD Stake" isXrd>
		<p>
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
		</p>
	</FungibleTokenAccordion>

	<FungibleTokenAccordion
		header="Some Other Token"
		iconUrl="https://picsum.photos/1000/500?shuffle"
	>
		<p>
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
		</p>
	</FungibleTokenAccordion>
</Story>

<Story name="NFT Collection Accordion">
	<NFTAccordion
		data={{
			name: 'Gipsy Kings',
			address: 'resource_tdx_22_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxmaesev',
			imageUrl: 'https://picsum.photos/1000/500',
			count: 1,
			tags: ['NFT', 'badge', 'gaming', 'NBA'],
			totalCount: 100000
		}}
	>
		<p>
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
		</p>
	</NFTAccordion>
	<NFTAccordion
		data={{
			name: 'Glumpy Gummy Bears',
			address: 'resource_tdx_22_1tknxxxxxfghjwrrd35safgdfsgrqqqwerdsfg98xxxxxxxxxmaesev',
			imageUrl: 'https://picsum.photos/1000/500?shuffle',
			count: 55,
			tags: ['premium', 'rare', 'NFT'],
			totalCount: 9000
		}}
	>
		<p>
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
		</p>
	</NFTAccordion>
	<NFTAccordion
		data={{
			address: 'resource_tdx_22_1tknxxxxxfghjwrrd35safgdfsgrqqqwerdsfg98xxxxxxxxxmaesev',
			count: 1,
			totalCount: 1
		}}
	>
		<p>
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
		</p>
	</NFTAccordion>
</Story>
