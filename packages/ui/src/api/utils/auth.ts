import type { StateEntityDetailsResponseItem } from '@common/gateway-sdk'

export const getSetMetadataAuth = ({
  details
}: StateEntityDetailsResponseItem): 'AllowAll' | string | undefined => {
  if (
    // @ts-ignore
    details.access_rules_chain?.method_auth?.find(
      // @ts-ignore
      (method) => method.method.name === 'set'
    )?.access_rule_reference?.access_rule.type === 'AllowAll'
  ) {
    return 'AllowAll'
  }

  // @ts-ignore
  const resourceProofRule = details.access_rules_chain?.method_auth?.find(
    // @ts-ignore
    (method) => method.method.name === 'set'
  )?.access_rule_reference?.access_rule.access_rule?.proof_rule?.resource

  if (resourceProofRule) {
    return `${resourceProofRule.resource_address}:${resourceProofRule.non_fungible_id.simple_rep}`
  }

  // @ts-ignore
  if (details.access_rules_chain?.default_auth?.type === 'AllowAll')
    return 'AllowAll'

  return
}
