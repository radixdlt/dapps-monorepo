<script lang="ts">
	import Box from '@svelte-ui/components/_base/box/Box.svelte';
	import Text from '@svelte-ui/components/_base/text/Text.svelte';

	export let title: string;
</script>

<Box center>
	<Text bold size="xlarge">{title}</Text>
	<Box justify="center" full>
		<slot />
	</Box>
</Box>
