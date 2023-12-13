import { isAllowed, type AuthInfo } from '@api/_deprecated/utils/auth'
import { isNil, map, pipe, reject } from 'ramda'

type RoleKey =
  | 'burner'
  | 'minter'
  | 'freezer'
  | 'recaller'
  | 'depositor'
  | 'withdrawer'
  | 'non_fungible_data_updater'
  | 'burner_updater'
  | 'minter_updater'
  | 'freezer_updater'
  | 'recaller_updater'
  | 'depositor_updater'
  | 'withdrawer_updater'
  | 'metadata_setter'
  | 'metadata_setter_updater'

export type Behavior =
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
  | 'freezable'
  | 'freezable-anyone'
  | 'info-can-change'
  | 'info-can-change-anyone'
  | 'removable-by-third-party'
  | 'removable-by-anyone'
  | 'nft-data-changeable'
  | 'nft-data-changeable-anyone'
  | 'info-can-change'
  | 'info-can-change-anyone'

const ruleToBehavior =
  (authInfo: AuthInfo) =>
  (
    rule: AuthInfo['rules'][keyof AuthInfo['rules']],
    roleKey: RoleKey
  ): Behavior | undefined => {
    const allowed = isAllowed(authInfo)(rule)

    if (allowed === 'by-someone') {
      switch (roleKey) {
        case 'burner':
        case 'burner_updater': {
          return 'supply-decrease'
        }
        case 'minter':
        case 'minter_updater': {
          return 'supply-increase'
        }
        case 'recaller':
        case 'recaller_updater': {
          return 'removable-by-third-party'
        }
        case 'freezer':
        case 'freezer_updater': {
          return 'freezable'
        }
        case 'non_fungible_data_updater': {
          return 'nft-data-changeable'
        }
        case 'depositor_updater':
        case 'withdrawer_updater': {
          return 'movement-restricted-future'
        }
        case 'metadata_setter':
        case 'metadata_setter_updater': {
          return 'info-can-change'
        }
      }
    }

    if (allowed === 'by-anyone') {
      switch (roleKey as RoleKey) {
        case 'burner':
        case 'burner_updater': {
          return 'supply-decrease-anyone'
        }
        case 'minter':
        case 'minter_updater': {
          return 'supply-increase-anyone'
        }
        case 'recaller':
        case 'recaller_updater': {
          return 'removable-by-anyone'
        }
        case 'freezer':
        case 'freezer_updater': {
          return 'freezable-anyone'
        }
        case 'non_fungible_data_updater': {
          return 'nft-data-changeable-anyone'
        }
        case 'depositor_updater':
        case 'withdrawer_updater': {
          return 'movement-restricted-future-anyone'
        }
        case 'metadata_setter':
        case 'metadata_setter_updater': {
          return 'info-can-change-anyone'
        }
      }
    }

    if (allowed === 'by-no-one') {
      switch (roleKey as RoleKey) {
        case 'depositor':
        case 'withdrawer': {
          return 'movement-restricted'
        }
      }
    }
  }

const getCombinedBehaviors = (behaviors: Behavior[]) => {
  if (behaviors.length === 0) return 'simple'

  let _behaviors = [...behaviors]

  const removeItem = (item: Behavior) => {
    _behaviors = _behaviors.filter((behavior) => behavior !== item)
  }

  if (
    behaviors.includes('supply-increase') &&
    behaviors.includes('supply-decrease')
  ) {
    removeItem('supply-increase')
    removeItem('supply-decrease')
    _behaviors.push('supply-increase-decrease')
  }

  if (
    behaviors.includes('supply-increase-anyone') &&
    behaviors.includes('supply-decrease-anyone')
  ) {
    removeItem('supply-increase-anyone')
    removeItem('supply-decrease-anyone')
    _behaviors.push('supply-increase-decrease-anyone')
  }

  if (
    behaviors.includes('supply-increase') &&
    behaviors.includes('supply-increase-anyone')
  ) {
    removeItem('supply-increase')
  }

  if (
    behaviors.includes('supply-decrease') &&
    behaviors.includes('supply-decrease-anyone')
  ) {
    removeItem('supply-decrease')
  }

  if (
    behaviors.includes('supply-increase-decrease') &&
    behaviors.includes('supply-increase-decrease-anyone')
  ) {
    removeItem('supply-increase-decrease')
  }

  if (
    behaviors.includes('movement-restricted') &&
    behaviors.includes('movement-restricted-future')
  ) {
    removeItem('movement-restricted-future')
  }

  if (
    behaviors.includes('movement-restricted-future') &&
    behaviors.includes('movement-restricted-future-anyone')
  ) {
    removeItem('movement-restricted-future')
  }

  if (
    behaviors.includes('removable-by-third-party') &&
    behaviors.includes('removable-by-anyone')
  ) {
    removeItem('removable-by-third-party')
  }

  if (
    behaviors.includes('freezable') &&
    behaviors.includes('freezable-anyone')
  ) {
    removeItem('freezable')
  }

  if (
    behaviors.includes('nft-data-changeable') &&
    behaviors.includes('nft-data-changeable-anyone')
  ) {
    removeItem('nft-data-changeable')
  }

  if (
    behaviors.includes('info-can-change') &&
    behaviors.includes('info-can-change-anyone')
  ) {
    removeItem('info-can-change')
  }

  return _behaviors
}

export const getBehaviors = (auth: AuthInfo) =>
  pipe(
    () => Object.entries(auth.rules),
    map(([roleKey, rule]) => ruleToBehavior(auth)(rule, roleKey as RoleKey)),
    (behaviors) => reject(isNil, behaviors),
    (behaviors) =>
      behaviors.filter(
        (behavior, index) => behaviors.indexOf(behavior) === index,
        behaviors
      ),
    getCombinedBehaviors
  )()
