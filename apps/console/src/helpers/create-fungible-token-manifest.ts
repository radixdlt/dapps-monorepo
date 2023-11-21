import {
  type AccessRule,
  accessRuleToManifestSyntax
} from './simple-access-rule-builder'

export const createFungibleTokenManifest = ({
  ownerAccessRule,
  accountAddress,
  trackSupply,
  divisibility,
  initialSupply,
  metadata,
  authRoles,
  metadataAuthRoles
}: {
  ownerAccessRule: AccessRule
  accountAddress: string
  trackSupply: boolean
  divisibility: string
  initialSupply: string
  metadata: string
  authRoles: string
  metadataAuthRoles: string
}) => {
  const txManifest = `CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
        ${accessRuleToManifestSyntax(ownerAccessRule)}
        ${trackSupply}
        ${divisibility}u8
        Decimal("${initialSupply}")
        Tuple(
          ${authRoles}
        )
        Tuple(
            Map<String, Tuple>(
              ${metadata}
            ),
            Map<String, Enum>(
              ${metadataAuthRoles}
            )
        )
        None
    ;
    
    CALL_METHOD
        Address("${accountAddress}")
        "try_deposit_batch_or_abort"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;
`
  return txManifest
}
