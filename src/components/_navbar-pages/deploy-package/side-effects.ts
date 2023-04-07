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
  abi: string,
  nftAddress: string,
  nftId: string
) => {
  const codeHash: string = hash(wasm).toString('hex')
  const abiHash: string = hash(abi).toString('hex')
  return `
    PUBLISH_PACKAGE 
    Blob("${codeHash}") 
    Blob("${abiHash}") 
    Map<String, Tuple>()       # Royalty Configuration
    Map<String, String>()      # Metadata 
    Tuple(                     # Access Rules Struct
        Map<Tuple, Enum>(       # Method auth Field
            Tuple(
                Enum("NodeModuleId::SELF"),
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
                Enum("NodeModuleId::SELF"),
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
                Enum("NodeModuleId::Metadata"),
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
                Enum("NodeModuleId::Metadata"),
                "get"
            ),
            Enum(
                "AccessRuleEntry::AccessRule", 
                Enum("AccessRule::AllowAll")
            )
        ), 
        Map<String, Enum>(),     # Grouped Auth Field
        Enum("AccessRule::DenyAll"),         # Default Auth Field
        Map<Tuple, Enum>(         # Method Auth Mutability Field
            Tuple(
                Enum("NodeModuleId::SELF"),
                "set_royalty_config"
            ),
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
            ),
            Tuple(
                Enum("NodeModuleId::SELF"),
                "claim_royalty"
            ),
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
            ),
            Tuple(
                Enum("NodeModuleId::Metadata"),
                "set"
            ), 
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
            ),
            Tuple(
                Enum("NodeModuleId::Metadata"),
                "get"
            ),
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
        Map<String, Enum>(),     # Group Auth Mutability Field
        Enum("AccessRule::DenyAll")          # Default Auth Mutability Field
    );
      `
}

export const createBadge = (accountAddress: string) =>
  sendTransaction(getCreateBadgeManifest(accountAddress))
