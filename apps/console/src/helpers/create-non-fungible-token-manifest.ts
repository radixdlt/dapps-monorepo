import {
  accessRuleToManifestSyntax,
  type AccessRule
} from './simple-access-rule-builder'

const standardDataSchema = `Array<Enum>(
                                Enum<0u8>(
                                    12u8
                                ),
                                Enum<0u8>(
                                    12u8
                                ),
                                Enum<0u8>(
                                    198u8
                                )
                            )`

export const createNonFungibleTokenManifest = ({
  ownerAccessRule,
  accountAddress,
  trackSupply,
  metadata,
  authRoles,
  metadataAuthRoles,
  nfts
}: {
  ownerAccessRule: AccessRule
  accountAddress: string
  trackSupply: boolean
  metadata: string
  authRoles: string
  metadataAuthRoles: string
  nfts: string
}) => {
  const txManifest = `
    CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
      ${accessRuleToManifestSyntax(ownerAccessRule)}
      Enum<1u8>()
      ${trackSupply}
      Enum<0u8>(
        Enum<0u8>(
          Tuple(
            Array<Enum>(
              Enum<14u8>(
                Array<Enum>(
                  Enum<0u8>(12u8),
                  Enum<0u8>(12u8),
                  Enum<0u8>(198u8)
                )
              )
            ),
            Array<Tuple>(
              Tuple(
                Enum<1u8>("MetadataStandardNonFungibleData"),
                Enum<1u8>(
                  Enum<0u8>(
                    Array<String>("name", "description","key_image_url")
                  )
                )
              )
            ),
            Array<Enum>(Enum<0u8>())
          )
        ),
        Enum<1u8>(0u64),
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
