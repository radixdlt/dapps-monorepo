import { sendTransaction } from '@api/wallet'
import {
  InstructionList,
  ManifestAstValue,
  ManifestBuilder
} from '@radixdlt/radix-engine-toolkit'
import { hash } from '@utils'
import { CURRENT_NETWORK } from '../../../network'

export const getCreateBadgeManifest = (
  accountAddress: string
): Promise<string> => {
  const manifest = new ManifestBuilder()
    .createNonFungibleResourceWithInitialSupply(
      new ManifestAstValue.Enum(
        new ManifestAstValue.EnumStringDiscriminator(
          'NonFungibleIdType::Integer'
        )
      ),
      new ManifestAstValue.Tuple([
        new ManifestAstValue.Tuple([
          new ManifestAstValue.Array(ManifestAstValue.Kind.Enum, []),
          new ManifestAstValue.Array(ManifestAstValue.Kind.Tuple, []),
          new ManifestAstValue.Array(ManifestAstValue.Kind.Enum, [])
        ]),
        new ManifestAstValue.Enum(new ManifestAstValue.EnumU8Discriminator(0), [
          new ManifestAstValue.U8(64)
        ]),
        new ManifestAstValue.Array(ManifestAstValue.Kind.String, [])
      ]),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.String,
        ManifestAstValue.Kind.String,
        [
          [
            new ManifestAstValue.String('name'),
            new ManifestAstValue.String('My Package Owner Badge')
          ],
          [
            new ManifestAstValue.String('description'),
            new ManifestAstValue.String(
              'This NFT was created by the Radix Dashboard as a simple badge to be used for default package control permissions. There is nothing special about it - swap it out, or create your own'
            )
          ]
        ]
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.Enum,
        ManifestAstValue.Kind.Tuple,
        [
          [
            new ManifestAstValue.Enum(
              new ManifestAstValue.EnumStringDiscriminator(
                'ResourceMethodAuthKey::Withdraw'
              )
            ),
            new ManifestAstValue.Tuple([
              new ManifestAstValue.Enum(
                new ManifestAstValue.EnumStringDiscriminator(
                  'AccessRule::AllowAll'
                )
              ),
              new ManifestAstValue.Enum(
                new ManifestAstValue.EnumStringDiscriminator(
                  'AccessRule::DenyAll'
                )
              )
            ])
          ],
          [
            new ManifestAstValue.Enum(
              new ManifestAstValue.EnumStringDiscriminator(
                'ResourceMethodAuthKey::Deposit'
              )
            ),
            new ManifestAstValue.Tuple([
              new ManifestAstValue.Enum(
                new ManifestAstValue.EnumStringDiscriminator(
                  'AccessRule::AllowAll'
                )
              ),
              new ManifestAstValue.Enum(
                new ManifestAstValue.EnumStringDiscriminator(
                  'AccessRule::DenyAll'
                )
              )
            ])
          ]
        ]
      ),
      new ManifestAstValue.Map(
        ManifestAstValue.Kind.NonFungibleLocalId,
        ManifestAstValue.Kind.Tuple,
        [
          [
            new ManifestAstValue.NonFungibleLocalId(
              new ManifestAstValue.Integer(1n)
            ),
            new ManifestAstValue.Tuple([
              new ManifestAstValue.Tuple([
                new ManifestAstValue.String('Hello World'),
                new ManifestAstValue.Decimal(12)
              ])
            ])
          ]
        ]
      )
    )
    .callMethod(accountAddress, 'deposit_batch', [
      new ManifestAstValue.Expression('ENTIRE_WORKTOP')
    ])
    .build()

  return manifest
    .convert(InstructionList.Kind.String, CURRENT_NETWORK.id)
    .then((manifest: any) => manifest.instructions.value)
}

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
  getCreateBadgeManifest(accountAddress).then((manifest) =>
    sendTransaction(manifest)
  )
