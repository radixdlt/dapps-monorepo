import { clone } from 'ramda'
import type {
  AuthInfo,
  AccessRule,
  ProtectedAccessRule
} from '../../../utils/auth'
import { getBehaviors } from './resource'

const mockAuthRule: ProtectedAccessRule = {
  type: 'Protected',
  access_rule: {
    type: 'ProofRule',
    proof_rule: {
      type: 'Require',
      requirement: {
        type: 'NonFungible',
        non_fungible: {
          local_id: {
            id_type: 'Bytes',
            sbor_hex: '',
            simple_rep: ''
          },
          resource_address: ''
        }
      }
    }
  }
}

describe('resource behaviors', () => {
  describe('supply', () => {
    const authInfo: AuthInfo = {
      owner: {} as any,
      rules: {
        minter: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['minter_updater']
        },
        burner: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['burner_updater']
        },
        minter_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['minter_updater']
        },
        burner_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['burner_updater']
        }
      }
    }

    it('should return supply increase', () => {
      const auth1 = clone(authInfo)
      auth1.rules.minter.rule = mockAuthRule

      const expectedBehaviors = ['supply-increase']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)

      auth2.rules.minter_updater.rule = mockAuthRule

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return supply increase by anyone', () => {
      const auth1 = clone(authInfo)
      auth1.rules.minter.rule.type = 'AllowAll'

      const expectedBehaviors = ['supply-increase-anyone']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)

      auth2.rules.minter_updater.rule.type = 'AllowAll'

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return supply decrease', () => {
      const auth1 = clone(authInfo)
      auth1.rules.burner.rule = mockAuthRule

      const expectedBehaviors = ['supply-decrease']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.burner_updater.rule = mockAuthRule

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return supply decrease by anyone', () => {
      const auth1 = clone(authInfo)
      auth1.rules.burner.rule.type = 'AllowAll'

      const expectedBehaviors = ['supply-decrease-anyone']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.burner_updater.rule.type = 'AllowAll'

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return supply increase and decrease', () => {
      const auth1 = clone(authInfo)
      auth1.rules.minter.rule = mockAuthRule
      auth1.rules.burner.rule = mockAuthRule

      const expectedBehaviors = ['supply-increase-decrease']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.minter_updater.rule = mockAuthRule
      auth2.rules.burner_updater.rule = mockAuthRule

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return supply increase and decrease by anyone', () => {
      const auth1 = clone(authInfo)
      auth1.rules.minter.rule.type = 'AllowAll'
      auth1.rules.burner.rule.type = 'AllowAll'

      const expectedBehaviors = ['supply-increase-decrease-anyone']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.minter_updater.rule.type = 'AllowAll'
      auth2.rules.burner_updater.rule.type = 'AllowAll'

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should only return supply increase by anyone if minter is explicit and minter_updater is AllowAll', () => {
      const auth = clone(authInfo)
      auth.rules.minter.rule = mockAuthRule
      auth.rules.minter_updater.rule.type = 'AllowAll'

      const expectedBehaviors = ['supply-increase-anyone']

      expect(getBehaviors(auth)).toEqual(expectedBehaviors)
    })
  })

  describe('movement', () => {
    const authInfo: AuthInfo = {
      owner: {} as any,
      rules: {
        depositor: {
          rule: {
            type: 'AllowAll'
          },
          updaters: ['depositor_updater']
        },
        withdrawer: {
          rule: {
            type: 'AllowAll'
          },
          updaters: ['withdrawer_updater']
        },
        depositor_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['depositor_updater']
        },
        withdrawer_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['withdrawer_updater']
        }
      }
    }

    it('should return movement restricted', () => {
      const auth = clone(authInfo)
      auth.rules.depositor.rule.type = 'DenyAll'

      const expectedBehaviors = ['movement-restricted']

      expect(getBehaviors(auth)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.withdrawer.rule.type = 'DenyAll'

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return movement restricted in future', () => {
      const auth1 = clone(authInfo)
      auth1.rules.depositor_updater.rule = mockAuthRule

      const expectedBehaviors = ['movement-restricted-future']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.withdrawer_updater.rule = mockAuthRule

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return movement restricted in future', () => {
      const auth1 = clone(authInfo)
      auth1.rules.depositor_updater.rule.type = 'AllowAll'

      const expectedBehaviors = ['movement-restricted-future-anyone']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.withdrawer_updater.rule.type = 'AllowAll'

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })
  })

  describe('removable', () => {
    const authInfo: AuthInfo = {
      owner: {} as any,
      rules: {
        recaller: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['recaller_updater']
        },
        recaller_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['recaller_updater']
        }
      }
    }

    it('should return third party can remove asset', () => {
      const auth1 = clone(authInfo)
      auth1.rules.recaller.rule = mockAuthRule

      const expectedBehaviors = ['removable-by-third-party']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.recaller_updater.rule = mockAuthRule

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return anyone can remove asset', () => {
      const auth1 = clone(authInfo)
      auth1.rules.recaller.rule.type = 'AllowAll'

      const expectedBehaviors = ['removable-by-anyone']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.recaller_updater.rule.type = 'AllowAll'

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })
  })

  describe('freezable', () => {
    const authInfo: AuthInfo = {
      owner: {} as any,
      rules: {
        freezer: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['freezer_updater']
        },
        freezer_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['freezer_updater']
        }
      }
    }

    it('should return third party can freeze asset', () => {
      const auth1 = clone(authInfo)
      auth1.rules.freezer.rule = mockAuthRule

      const expectedBehaviors = ['freezable']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.freezer_updater.rule = mockAuthRule

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })

    it('should return anyone can freeze asset', () => {
      const auth1 = clone(authInfo)
      auth1.rules.freezer.rule.type = 'AllowAll'

      const expectedBehaviors = ['freezable-anyone']

      expect(getBehaviors(auth1)).toEqual(expectedBehaviors)

      const auth2 = clone(authInfo)
      auth2.rules.freezer_updater.rule.type = 'AllowAll'

      expect(getBehaviors(auth2)).toEqual(expectedBehaviors)
    })
  })

  describe('non-fungible-data updatable', () => {
    const authInfo: AuthInfo = {
      owner: {} as any,
      rules: {
        non_fungible_data_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['non_fungible_data_updater']
        }
      }
    }

    it('should return data on nfts can be changed', () => {
      const auth = clone(authInfo)
      auth.rules.non_fungible_data_updater.rule = mockAuthRule

      const expectedBehaviors = ['nft-data-changeable']

      expect(getBehaviors(auth)).toEqual(expectedBehaviors)
    })

    it('should return data on nfts can be changed by anyone', () => {
      const auth = clone(authInfo)
      auth.rules.non_fungible_data_updater.rule.type = 'AllowAll'

      const expectedBehaviors = ['nft-data-changeable-anyone']

      expect(getBehaviors(auth)).toEqual(expectedBehaviors)
    })
  })

  describe('simple asset', () => {
    const authInfo: AuthInfo = {
      owner: {} as any,
      rules: {
        minter: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['minter_updater']
        },
        burner: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['burner_updater']
        },
        minter_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['minter_updater']
        },
        burner_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['burner_updater']
        },
        depositor: {
          rule: {
            type: 'AllowAll'
          },
          updaters: ['depositor_updater']
        },
        withdrawer: {
          rule: {
            type: 'AllowAll'
          },
          updaters: ['withdrawer_updater']
        },
        depositor_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['depositor_updater']
        },
        withdrawer_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['withdrawer_updater']
        },
        recaller: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['recaller_updater']
        },
        recaller_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['recaller_updater']
        },
        non_fungible_data_updater: {
          rule: {
            type: 'DenyAll'
          },
          updaters: ['non_fungible_data_updater']
        }
      }
    }

    it('should return simple asset', () => {
      const auth = clone(authInfo)

      const expectedBehavior = 'simple'

      expect(getBehaviors(auth)).toEqual(expectedBehavior)
    })
  })

  describe('owner behavior', () => {
    const authInfo: AuthInfo = {
      owner: mockAuthRule,
      rules: {
        minter: {
          rule: {
            type: 'Owner'
          },
          updaters: ['minter_updater']
        }
      }
    }

    it('should return supply increase when owner is set', () => {
      const auth = clone(authInfo)

      const expectedBehavior = ['supply-increase']

      expect(getBehaviors(auth)).toEqual(expectedBehavior)
    })

    it('should return simple when owner is DenyAll', () => {
      const auth = clone(authInfo)
      auth.owner.type = 'DenyAll'

      const expectedBehavior = 'simple'

      expect(getBehaviors(auth)).toEqual(expectedBehavior)
    })
  })
})
