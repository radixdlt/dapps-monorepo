<script>
  import { goto } from '$app/navigation'
  import Box from '@components/_base/box/Box.svelte'
  import Image from '@components/_base/image/Image.svelte'
  import Logo from '@images/dashboard_logo.svg'
</script>

<Box on:click={() => goto('/')} p="none" m="none">
  <Image cx={{ cursor: 'pointer' }} height="$md" alt="logo" src={Logo} />
</Box>
