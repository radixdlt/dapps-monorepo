import { ManifestClass } from '@common/gateway-sdk'

export const getMostRelevantManifestClass = (
  classes: ManifestClass[] | undefined | null
): ManifestClass | string => {
  if (!classes || classes.length === 0) {
    return ''
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
