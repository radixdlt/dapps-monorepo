<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Simple from '@icons/behavior-simple-asset.svg'
  import Decrease from '@icons/behavior-supply-decrease.svg'
  import Increase from '@icons/behavior-supply-increase.svg'
  import IncreaseDecrease from '@icons/behavior-supply-increase-decrease.svg'
  import IncreaseAnyone from '@icons/behavior-supply-increase-anyone.svg'
  import DecreaseAnyone from '@icons/behavior-supply-decrease-anyone.svg'
  import IncreaseDecreaseAnyone from '@icons/behavior-supply-increase-decrease-anyone.svg'
  import MovementRestricted from '@icons/behavior-movement-restricted.svg'
  import MovementRestrictedFuture from '@icons/behavior-movement-restricted-future.svg'
  import InfoCanChange from '@icons/behavior-info-can-change.svg'
  import InfoCanChangeAnyone from '@icons/behavior-info-can-change-anyone.svg'
  import RemovableByThirdParty from '@icons/behavior-removable-by-third-party.svg'
  import RemovableByAnyone from '@icons/behavior-removable-by-anyone.svg'
  import NftDataChangeable from '@icons/behavior-nft-data-changeable.svg'
  import NftDataChangeableAnyone from '@icons/behavior-nft-data-changeable-anyone.svg'

  export let type:
    | 'simple'
    | 'supply-increase'
    | 'supply-decrease'
    | 'supply-increase-decrease'
    | 'supply-increase-anyone'
    | 'supply-decrease-anyone'
    | 'supply-increase-decrease-anyone'
    | 'movement-restricted'
    | 'movement-restricted-future'
    | 'movement-restricted-future-anyone'
    | 'info-can-change'
    | 'info-can-change-anyone'
    | 'removable-by-third-party'
    | 'removable-by-anyone'
    | 'nft-data-changeable'
    | 'nft-data-changeable-anyone'

  $: text = {
    simple: 'This is a simple asset.',

    'supply-increase': 'The supply of this asset can be increased.',

    'supply-decrease': 'The supply of this asset can be decreased.',

    'supply-increase-decrease':
      'The supply of this asset can be increased or decreased.',

    'supply-increase-anyone': 'Anyone can increase the supply of this asset.',

    'supply-decrease-anyone': 'Anyone can decrease the supply of this asset.',

    'supply-increase-decrease-anyone':
      'Anyone can increase or decrease the supply of this asset.',

    'movement-restricted': 'Movement of this asset is restricted.',

    'movement-restricted-future':
      'Movement of this asset can be restricted in the future.',

    'movement-restricted-future-anyone':
      'Anyone can restrict movement of this asset in the future.',

    'info-can-change': 'Naming and information of this asset can be changed.',

    'info-can-change-anyone':
      'Anyone can change the naming and information of this asset.',

    'removable-by-third-party':
      'A third party can remove this asset from accounts and dApps.',

    'removable-by-anyone':
      'Anyone can remove this asset from accounts and dApps.',

    'nft-data-changeable': 'Data that is set on these NFTs can be changed.',

    'nft-data-changeable-anyone':
      'Anyone can change the data that is set on these NFTs.'
  }[type]

  $: icon = {
    simple: Simple,

    'supply-increase': Increase,

    'supply-decrease': Decrease,

    'supply-increase-decrease': IncreaseDecrease,

    'supply-increase-anyone': IncreaseAnyone,

    'supply-decrease-anyone': DecreaseAnyone,

    'supply-increase-decrease-anyone': IncreaseDecreaseAnyone,

    'movement-restricted': MovementRestricted,

    'movement-restricted-future': MovementRestrictedFuture,

    'movement-restricted-future-anyone': MovementRestrictedFuture,

    'info-can-change': InfoCanChange,

    'info-can-change-anyone': InfoCanChangeAnyone,

    'removable-by-third-party': RemovableByThirdParty,

    'removable-by-anyone': RemovableByAnyone,

    'nft-data-changeable': NftDataChangeable,

    'nft-data-changeable-anyone': NftDataChangeableAnyone
  }[type]

  $: iconSize = {
    simple: '1.5rem',
    'supply-increase': '1.5rem',
    'supply-decrease': '1.5rem',
    'supply-increase-decrease': '2.7rem',
    'supply-increase-anyone': '2rem',
    'supply-decrease-anyone': '2rem',
    'supply-increase-decrease-anyone': '2.7rem',
    'movement-restricted': '2rem',
    'movement-restricted-future': '2.3rem',
    'movement-restricted-future-anyone': '2.3rem',
    'info-can-change': '1.3rem',
    'info-can-change-anyone': '1.7rem',
    'removable-by-third-party': '2rem',
    'removable-by-anyone': '2rem',
    'nft-data-changeable': '1.3rem',
    'nft-data-changeable-anyone': '1.3rem'
  }[type]
</script>

<div class="behavior">
  <div class="icon">
    <IconNew {icon} --size={iconSize} />
  </div>
  <div class="text">
    {text}
  </div>
</div>

<style>
  .behavior {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
  }

  .icon {
    background: var(--color-grey-4);
    width: 2.75rem;
    height: 2.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-lg);
  }

  .text {
    font-size: var(--text-lg);
  }
</style>
