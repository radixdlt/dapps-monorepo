import { sendTransaction } from '@api/wallet'
import { hash } from '@utils'

export const getCreateBadgeManifest = (accountAddress: string) => `
# Creating a new resource 
CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
    # Owner role - This gets metadata permissions, and is the default for other permissions
    # Can set as Enum<OwnerRole::Fixed>(access_rule)  or Enum<OwnerRole::Updatable>(access_rule)
    Enum<OwnerRole::None>()
    Enum<NonFungibleIdType::Integer>()                                                                  # The type of NonFungible Id
    true                                                                                                # Whether the engine should track supply (avoid for massively parallelizable tokens)
    Tuple(Tuple(Array<Enum>(), Array<Tuple>(), Array<Enum>()), Enum<0u8>(64u8), Array<String>())        # Non Fungible Data Schema
    Map<NonFungibleLocalId, Tuple>(                                                                     # Initial supply to mint
        NonFungibleLocalId("#1#") => Tuple(Tuple("Hello World", Decimal("12")))
    )
    Tuple(
        Some(         # Mint Roles (if None: defaults to DenyAll, DenyAll)
            Tuple(
                Some(Enum<AccessRule::AllowAll>()),  # Minter (if None: defaults to Owner)
                Some(Enum<AccessRule::DenyAll>())    # Minter Updater (if None: defaults to Owner)
            )
        ),
        None,        # Burn Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Freeze Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Recall Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Withdraw Roles (if None: defaults to AllowAll, DenyAll)
        None,        # Deposit Roles (if None: defaults to AllowAll, DenyAll)
        None         # Non Fungible Data Update Roles (if None: defaults to DenyAll, DenyAll)
    )
    Tuple(                                                                   # Metadata initialization
        Map<String, Tuple>(                                                  # Initial metadata values
            "name" => Tuple(
                Some(Enum<Metadata::String>("My Package Owner Badge")),    # Resource Name
                true                                                         # Locked
            ),
            "description" => Tuple(
               Some(Enum<Metadata::String>("This NFT was created by the Radix Sandbox dApp as a simple badge to be used for default package control permissions.")),    # Resource Name
                true 
            )
        ),
        Map<String, Enum>(                                                   # Metadata roles
            "metadata_setter" => Some(Enum<AccessRule::AllowAll>()),         # Metadata setter role
            "metadata_setter_updater" => None,                               # Metadata setter updater role as None defaults to OWNER
            "metadata_locker" => Some(Enum<AccessRule::DenyAll>()),          # Metadata locker role
            "metadata_locker_updater" => None                                # Metadata locker updater role as None defaults to OWNER
        )
    )
    None;             # No Address Reservation

# Depositing the entirety of the initial supply of the newly created resource into our account 
# component.
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
        Enum<AccessRule::AllowAll>() # Owner AccessRule
        ${schema}                    # Package Definition
        Blob("${wasmHash}")          # Package Code
        Map<String, Tuple>()         # Metadata
        None;                        # Address Reservation
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
