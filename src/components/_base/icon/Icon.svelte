<script lang="ts">
  import Image from '../image/Image.svelte'

  const icons = {
    dashboard: '/icons/dashboard.svg',
    blocks: '/icons/blocks.svg',
    tokens: '/icons/tokens.svg',
    transactions: '/icons/transactions.svg',
    accounts: '/icons/accounts.svg',
    validators: '/icons/validators.svg'
  }

  export let isActive = false
  export let type: keyof typeof icons
  export let interactive: boolean | undefined = undefined

  const style = {
    width: '$sm',
    height: '$sm',
    cursor: interactive ? 'pointer' : 'default',
    filter: !isActive ? 'grayscale(100%)' : '',
    '&:active': {
      filter: 'grayscale(100%)'
    },
    '&:hover': {
      filter: '$iconHover'
    }
  }
</script>

<Image cx={style} width="$sm" height="$sm" alt="dashboard" src={icons[type]} />
