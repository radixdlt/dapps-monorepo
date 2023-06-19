import { sendTransaction } from '@api/wallet'
import { hash } from '@utils'

export const getCreateBadgeManifest = (accountAddress: string) => `
  CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
    Enum<NonFungibleIdType::Integer>()
    Tuple(Tuple(Array<Enum>(), Array<Tuple>(), Array<Enum>()), Enum<0u8>(64u8), Array<String>())
    Map<String, Enum>(
        "name" => Enum<Metadata::String>("My Package Owner Badge"),                                     
        "description" => Enum<Metadata::String>("This NFT was created by the Radix Sandbox dApp as a simple badge to be used for default package control permissions.")   
    )
    Map<Enum, Tuple>(
        Enum<ResourceMethodAuthKey::Withdraw>() => Tuple(Enum<AccessRule::AllowAll>(), Enum<AccessRule::DenyAll>()),
        Enum<ResourceMethodAuthKey::Deposit>() => Tuple(Enum<AccessRule::AllowAll>(), Enum<AccessRule::DenyAll>())
    )
    Map<NonFungibleLocalId, Tuple>(
        NonFungibleLocalId("#1#") => 
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
        None
        Blob("${wasmHash}") 
        ${schema}
        Map<String, Tuple>()      
        Map<String, Enum>()  
        Map<Enum, Tuple>();    
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
