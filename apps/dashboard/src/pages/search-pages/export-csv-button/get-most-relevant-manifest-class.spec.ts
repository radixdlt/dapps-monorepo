import { ManifestClass } from '@common/gateway-sdk'
import { getMostRelevantManifestClass } from './get-most-relevant-manifest-class'

describe('get most relevant manifest class', () => {
  it('should return transfer when it is in the second place', () => {
    const classes = [ManifestClass.General, ManifestClass.Transfer]

    const result = getMostRelevantManifestClass(classes)

    expect(result).toEqual(ManifestClass.Transfer)
  })

  it('should return transfer when it is in the first place', () => {
    const classes = [ManifestClass.Transfer, ManifestClass.General]

    const result = getMostRelevantManifestClass(classes)

    expect(result).toEqual(ManifestClass.Transfer)
  })

  it('should return pool redemption as first', () => {
    const classes = [
      ManifestClass.General,
      ManifestClass.PoolContribution,
      ManifestClass.ValidatorStake,
      ManifestClass.AccountDepositSettingsUpdate,
      ManifestClass.PoolRedemption,
      ManifestClass.ValidatorUnstake,
      ManifestClass.Transfer
    ]

    const result = getMostRelevantManifestClass(classes)

    expect(result).toEqual(ManifestClass.PoolRedemption)
  })

  it('should return empty string for empty input', () => {
    expect(getMostRelevantManifestClass(null)).toEqual('')
    expect(getMostRelevantManifestClass(undefined)).toEqual('')
    expect(getMostRelevantManifestClass([])).toEqual('')
  })
})
