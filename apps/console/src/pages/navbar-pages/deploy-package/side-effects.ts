import { sendTransaction } from '@api/wallet'
import { hash } from '@utils'

export const getCreateBadgeManifest = (accountAddress: string) => `
CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
    Enum<0u8>()
    Enum<1u8>()
    true
    Enum<NonFungibleDataSchema::Local>(
        Enum<0u8>(
            Tuple(
                Array<Enum>(),
                Array<Tuple>(),
                Array<Enum>()
            )
        ),
        Enum<0u8>(
            66u8
        ),
        Array<String>()
    )
    Map<NonFungibleLocalId, Tuple>(
        NonFungibleLocalId("#1#") => Tuple(
            Tuple()
        )
    )
    Tuple(
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>()
    )
    Tuple(
        Map<String, Tuple>(
            "description" => Tuple(
                Enum<1u8>(
                    Enum<0u8>(
                        "This NFT was created by the Radix Sandbox dApp as a simple badge to be used for default package control permissions."
                    )
                ),
                false
            ),
            "name" => Tuple(
                Enum<1u8>(
                    Enum<0u8>(
                        "My Package Owner Badge"
                    )
                ),
                false
            ),
            "tags" => Tuple(
                Enum<1u8>(
                    Enum<128u8>(
                        Array<String>(
                            "badge"
                        )
                    )
                ),
                false
            )
        ),
        Map<String, Enum>()
    )
    Enum<0u8>()
;
CALL_METHOD
    Address("${accountAddress}")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
`

export const getDeployPackageManifest = (
  account: string,
  wasm: string,
  schema: string,
  nftAddress: string,
  nftId: string
) => {
  const wasmHash: string = hash(wasm).toString('hex')

  return `
CALL_METHOD
    Address("${account}")
    "create_proof_of_non_fungibles"
    Address("${nftAddress}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nftId}")
    )
;
PUBLISH_PACKAGE_ADVANCED
     Enum<OwnerRole::Fixed>(     # Owner Role
        Enum<AccessRule::Protected>(
            Enum<AccessRuleNode::ProofRule>(
                Enum<ProofRule::Require>(
                    Enum<0u8>(   # ResourceOrNonFungible::NonFungible
                        NonFungibleGlobalId("${nftAddress}:${nftId}")
                    )
                )
            )
        )
    )
    ${schema}                    # Package Definition
    Blob("${wasmHash}")          # Package Code
    Map<String, Tuple>()         # Metadata
    None                         # Address Reservation
;
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
