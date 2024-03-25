import { ManifestClass } from '@common/gateway-sdk'

export const getMostRelevantManifestClass = (
  classes: ManifestClass[] | undefined | null
): ManifestClass | undefined => {
  if (!classes || classes.length === 0) {
    return undefined
  }

  const severityOrder: ManifestClass[] = [
    ManifestClass.PoolRedemption,
    ManifestClass.PoolContribution,
    ManifestClass.AccountDepositSettingsUpdate,
    ManifestClass.ValidatorClaim,
    ManifestClass.ValidatorUnstake,
    ManifestClass.ValidatorStake,
    ManifestClass.Transfer,
    ManifestClass.General
  ]
  const sorted = classes.sort(
    (a, b) => severityOrder.indexOf(a) - severityOrder.indexOf(b)
  )
  return sorted[0]
}

export const getManifestClassDescription = (
  manifestClass: ManifestClass | string | undefined
): string => {
  if (!manifestClass) {
    return 'Other'
  }

  const descriptions: Record<ManifestClass, string> = {
    [ManifestClass.PoolRedemption]: 'Pool Redemption',
    [ManifestClass.PoolContribution]: 'Pool Contribution',
    [ManifestClass.AccountDepositSettingsUpdate]: 'Deposit Settings',
    [ManifestClass.ValidatorClaim]: 'Validator Claim',
    [ManifestClass.ValidatorUnstake]: 'Validator Unstake',
    [ManifestClass.ValidatorStake]: 'Validator Stake',
    [ManifestClass.Transfer]: 'Transfer',
    [ManifestClass.General]: 'General'
  }

  return descriptions[manifestClass as ManifestClass]
}
