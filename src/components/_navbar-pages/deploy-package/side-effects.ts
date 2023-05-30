import { sendTransaction } from '@api/wallet'
import { hash } from '@utils'

export const getCreateBadgeManifest = (accountAddress: string) => `
  CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
    Enum("NonFungibleIdType::Integer")
    Tuple(Tuple(Array<Enum>(), Array<Tuple>(), Array<Enum>()), Enum(0u8, 64u8), Array<String>())
    Map<String, String>(
        "name", "My Package Owner Badge",
        "description", "This NFT was created by the Radix Dashboard as a simple badge to be used for default package control permissions. There is nothing special about it - swap it out, or create your own"
    )
    Map<Enum, Tuple>(
        Enum("ResourceMethodAuthKey::Withdraw"), Tuple(Enum("AccessRule::AllowAll"), Enum("AccessRule::DenyAll")),
        Enum("ResourceMethodAuthKey::Deposit"), Tuple(Enum("AccessRule::AllowAll"), Enum("AccessRule::DenyAll"))
    )
    Map<NonFungibleLocalId, Tuple>(
        NonFungibleLocalId("#1#"),
        Tuple(Tuple("Hello World", Decimal("12")))
    );

CALL_METHOD
    Address("${accountAddress}") 
    "deposit_batch"
    Expression("ENTIRE_WORKTOP");
`

export const getDeployPackageManifest = (
  wasm: string,
  schema: string,
  nftAddress: string,
  nftId: string
) => {
  const wasmHash: string = hash(wasm).toString('hex')

  return `
   PUBLISH_PACKAGE_ADVANCED
    Blob("${wasmHash}") 
    ${schema}
    Map<String, Tuple>()       # Royalty Configuration
    Map<String, String>()      # Metadata 
    Tuple(                     # Access Rules Config Struct
        Map<Tuple, Enum>(),     # Direct Access Method auth Field
        Map<Tuple, Enum>(       # Method auth Field
            Tuple(
                Enum("TypedModuleId::ObjectState"),
                "set_royalty_config"
            ),
            Enum(
                "AccessRuleEntry::AccessRule", 
                Enum(
                    "AccessRule::Protected", 
                    Enum(
                        "AccessRuleNode::ProofRule", 
                        Enum(
                            "ProofRule::Require", 
                            Enum(
                                "SoftResourceOrNonFungible::StaticNonFungible", 
                                NonFungibleGlobalId("${nftAddress}:${nftId}")
                            )
                        )
                    )
                )
            ),
            Tuple(
                Enum("TypedModuleId::ObjectState"),
                "claim_royalty"
            ),
            Enum(
                "AccessRuleEntry::AccessRule", 
                Enum(
                    "AccessRule::Protected", 
                    Enum(
                        "AccessRuleNode::ProofRule", 
                        Enum(
                            "ProofRule::Require", 
                            Enum(
                                "SoftResourceOrNonFungible::StaticNonFungible", 
                                NonFungibleGlobalId("${nftAddress}:${nftId}")
                            )
                        )
                    )
                )
            ),
            Tuple(
                Enum("TypedModuleId::Metadata"),
                "set"
            ),
            Enum(
                "AccessRuleEntry::AccessRule", 
                Enum(
                    "AccessRule::Protected", 
                    Enum(
                        "AccessRuleNode::ProofRule", 
                        Enum(
                            "ProofRule::Require", 
                            Enum(
                                "SoftResourceOrNonFungible::StaticNonFungible", 
                                NonFungibleGlobalId("${nftAddress}:${nftId}")
                            )
                        )
                    )
                )
            ),
            Tuple(
                Enum("TypedModuleId::Metadata"),
                "get"
            ),
            Enum(
                "AccessRuleEntry::AccessRule", 
                Enum("AccessRule::AllowAll")
            )
        ), 
        Map<String, Enum>(),     # Grouped Auth Field
        Enum(
            "AccessRuleEntry::AccessRule",
            Enum("AccessRule::DenyAll")         # Default Auth Field
        ),
        Map<Tuple, Enum>(         # Method Auth Mutability Field
            Tuple(
                Enum("TypedModuleId::ObjectState"),
                "set_royalty_config"
            ),
            Enum(
                "AccessRuleEntry::AccessRule",
                Enum(
                    "AccessRule::Protected",
                    Enum(
                        "AccessRuleNode::ProofRule",
                        Enum(
                            "ProofRule::Require",
                            Enum(
                                "SoftResourceOrNonFungible::StaticNonFungible",
                                NonFungibleGlobalId("${nftAddress}:${nftId}")
                            )
                        )
                    )
                )
            ),
            Tuple(
                Enum("TypedModuleId::ObjectState"),
                "claim_royalty"
            ),
            Enum(
                "AccessRuleEntry::AccessRule",
                Enum(
                    "AccessRule::Protected",
                    Enum(
                        "AccessRuleNode::ProofRule",
                        Enum(
                            "ProofRule::Require",
                            Enum(
                                "SoftResourceOrNonFungible::StaticNonFungible",
                                NonFungibleGlobalId("${nftAddress}:${nftId}")
                            )
                        )
                    )
                )
            ),
            Tuple(
                Enum("TypedModuleId::Metadata"),
                "set"
            ),
            Enum(
                "AccessRuleEntry::AccessRule",
                Enum(
                    "AccessRule::Protected",
                    Enum(
                        "AccessRuleNode::ProofRule",
                        Enum(
                            "ProofRule::Require",
                            Enum(
                                "SoftResourceOrNonFungible::StaticNonFungible",
                                NonFungibleGlobalId("${nftAddress}:${nftId}")
                            )
                        )
                    )
                )
            ),
            Tuple(
                Enum("TypedModuleId::Metadata"),
                "get"
            ),
            Enum(
                "AccessRuleEntry::AccessRule",
                Enum(
                    "AccessRule::Protected",
                    Enum(
                        "AccessRuleNode::ProofRule",
                        Enum(
                            "ProofRule::Require",
                            Enum(
                                "SoftResourceOrNonFungible::StaticNonFungible",
                                NonFungibleGlobalId("${nftAddress}:${nftId}")
                            )
                        )
                    )
                )
            )
        ), 
        Map<String, Enum>(),     # Group Auth Mutability Field
        Enum(
            "AccessRuleEntry::AccessRule",
            Enum("AccessRule::DenyAll")          # Default Auth Mutability Field
        )
    );
      `
}

export const sborDecodeSchema = (schema: string) => {
  return fetch('api/ret/sbor-decode', {
    method: 'POST',
    body: JSON.stringify({
      hexEncodedSchema: schema
    })
  })
    .then((res) => res.json())
    .then((res) => res.decodedString)
}

export const createBadge = (accountAddress: string) =>
  sendTransaction(getCreateBadgeManifest(accountAddress))
