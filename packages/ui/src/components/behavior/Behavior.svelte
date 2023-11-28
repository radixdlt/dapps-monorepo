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
  import type { Behavior } from '@api/utils/entities/resource'

  export let isXRD = false
  export let type: Behavior

  let info: { icon: string; text: string; iconSize: string } | undefined

  $: info = {
    simple: {
      icon: Simple,
      text: 'This is a simple asset.',
      iconSize: '1.5rem'
    },
    'supply-increase': {
      icon: Increase,
      text: 'The supply of this asset can be increased.',
      iconSize: '1.5rem'
    },
    'supply-decrease': {
      icon: Decrease,
      text: 'The supply of this asset can be decreased.',
      iconSize: '1.5rem'
    },
    'supply-increase-decrease': {
      icon: IncreaseDecrease,
      text: isXRD
        ? 'Only the Radix Network may increase or decrease the supply of XRD.'
        : 'The supply of this asset can be increased or decreased.',
      iconSize: '2.7rem'
    },
    'supply-increase-anyone': {
      icon: IncreaseAnyone,
      text: 'Anyone can increase the supply of this asset.',
      iconSize: '2rem'
    },
    'supply-decrease-anyone': {
      icon: DecreaseAnyone,
      text: 'Anyone can decrease the supply of this asset.',
      iconSize: '2rem'
    },
    'supply-increase-decrease-anyone': {
      icon: IncreaseDecreaseAnyone,
      text: 'Anyone can increase or decrease the supply of this asset.',
      iconSize: '2.7rem'
    },
    'movement-restricted': {
      icon: MovementRestricted,
      text: 'Movement of this asset is restricted.',
      iconSize: '2rem'
    },
    'movement-restricted-future': {
      icon: MovementRestrictedFuture,
      text: 'Movement of this asset can be restricted in the future.',
      iconSize: '2.3rem'
    },
    'movement-restricted-future-anyone': {
      icon: MovementRestrictedFuture,
      text: 'Anyone can restrict movement of this asset in the future.',
      iconSize: '2.3rem'
    },
    'info-can-change': {
      icon: InfoCanChange,
      text: 'Naming and information of this asset can be changed.',
      iconSize: '1.3rem'
    },
    'info-can-change-anyone': {
      icon: InfoCanChangeAnyone,
      text: 'Anyone can change the naming and information of this asset.',
      iconSize: '1.7rem'
    },
    'removable-by-third-party': {
      icon: RemovableByThirdParty,
      text: 'A third party can remove this asset from accounts and dApps.',
      iconSize: '2rem'
    },
    'removable-by-anyone': {
      icon: RemovableByAnyone,
      text: 'Anyone can remove this asset from accounts and dApps.',
      iconSize: '2rem'
    },
    freezable: {
      icon: RemovableByThirdParty,
      text: 'A third party can freeze this asset in place.',
      iconSize: '2rem'
    },
    'freezable-anyone': {
      icon: RemovableByAnyone,
      text: 'Anyone can freeze this asset in place.',
      iconSize: '2rem'
    },
    'nft-data-changeable': {
      icon: NftDataChangeable,
      text: 'Data that is set on these NFTs can be changed.',
      iconSize: '1.3rem'
    },
    'nft-data-changeable-anyone': {
      icon: NftDataChangeableAnyone,
      text: 'Anyone can change the data that is set on these NFTs.',
      iconSize: '1.3rem'
    }
  }[type]

  $: if (isXRD && type === 'info-can-change') info = undefined
</script>

{#if info}
  <div class="behavior">
    <div class="icon">
      <IconNew icon={info.icon} --size={info.iconSize} />
    </div>
    <div class="text">
      {info.text}
    </div>
  </div>
{/if}

<style>
  .behavior {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
    max-width: 20rem;
  }

  .icon {
    background: var(--color-grey-4);
    width: 2.75rem;
    height: 2.75rem;
    min-width: 2.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-lg);
  }

  .text {
    font-size: var(--text-lg);
  }
</style>
