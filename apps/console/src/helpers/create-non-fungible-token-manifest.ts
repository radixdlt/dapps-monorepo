import {
  accessRuleToManifestSyntax,
  type AccessRule,
  OwnerAccessRuleUpdatable
} from './simple-access-rule-builder'

export const createNonFungibleTokenManifest = ({
  ownerAccessRule,
  ownerAccessRuleUpdatable,
  accountAddress,
  trackSupply,
  metadata,
  authRoles,
  metadataAuthRoles,
  nfts
}: {
  ownerAccessRule: AccessRule
  ownerAccessRuleUpdatable: OwnerAccessRuleUpdatable
  accountAddress: string
  trackSupply: boolean
  metadata: string
  authRoles: string
  metadataAuthRoles: string
  nfts: string
}) => {
  const txManifest = `
    CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
      ${accessRuleToManifestSyntax(ownerAccessRule, ownerAccessRuleUpdatable)}
      Enum<1u8>()
      ${trackSupply}
      Enum<0u8>(
        Enum<0u8>(
            Tuple(
                Array<Enum>(
                    Enum<14u8>(
                        Array<Enum>(
                            Enum<0u8>(
                                12u8
                            ),
                            Enum<0u8>(
                                12u8
                            ),
                            Enum<0u8>(
                                198u8
                            )
                        )
                    )
                ),
                Array<Tuple>(
                    Tuple(
                        Enum<1u8>(
                            "DataSchema"
                        ),
                        Enum<1u8>(
                            Enum<0u8>(
                                Array<String>(
                                    "name",
                                    "description",
                                    "key_image_url"
                                )
                            )
                        )
                    )
                ),
                Array<Enum>(
                    Enum<0u8>()
                )
            )
        ),
        Enum<1u8>(
            0u64
        ),
        Array<String>()
    )
    Map<NonFungibleLocalId, Tuple>(
        ${nfts}
      )
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
      Enum<0u8>()
  ;

  CALL_METHOD
      Address("${accountAddress}")
      "try_deposit_batch_or_abort"
      Expression("ENTIRE_WORKTOP")
      Enum<0u8>()
  ;`

  console.log(txManifest)
  return txManifest
}
