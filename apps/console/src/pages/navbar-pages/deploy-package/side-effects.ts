import { sendTransaction } from '@api/wallet'
import { hash } from '@utils'
import { http } from '@common/http'

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
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
`

export const getDeployPackageManifest = (
  account: string,
  wasm: string,
  schema: string
) => {
  const wasmHash: string = hash(wasm).toString('hex')

  const transactionManifest = `
    PUBLISH_PACKAGE
      ${schema}                    
      Blob("${wasmHash}")          
      Map<String, Tuple>()         
    ;

    CALL_METHOD
      Address("${account}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
    ;
    `
  return transactionManifest
}

export const sborDecodeSchema = async (schema: string) =>
  http
    .post('api/ret/sbor-decode', {
      hexEncodedSchema: schema
    })
    .then((res) => res.decodedString)

export const createBadge = (accountAddress: string) =>
  sendTransaction(getCreateBadgeManifest(accountAddress))
