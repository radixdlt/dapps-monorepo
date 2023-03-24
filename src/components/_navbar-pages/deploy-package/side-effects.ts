import {
  getEntitiesDetails,
  getEntityDetails,
  getEntityNonFungibleIDs,
  getEntityNonFungibleVaults
} from '@api/gateway'
import { getMetadata } from '@api/utils/resources'
import { sendTransaction } from '@api/wallet'
import type { StateEntityDetailsResponse } from '@radixdlt/babylon-gateway-api-sdk'
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
  accountAddress: string,
  nftAddress: string,
  nftId: string
) => {
  const codeHash: string = hash(wasm).toString('hex')
  const abiHash: string = hash(abi).toString('hex')
  return `
      PUBLISH_PACKAGE_WITH_OWNER 
        Blob("${codeHash}") 
        Blob("${abiHash}")
        NonFungibleGlobalId("${nftAddress}:${nftId}");

      CALL_METHOD 
        ComponentAddress("${accountAddress}") 
        "deposit_batch" 
        Expression("ENTIRE_WORKTOP");
      `
}

export const queryResources = async (selectedAccountAddress: string) => {
  const details = await getEntityDetails(selectedAccountAddress)
  const non_fungible_resources = details.non_fungible_resources || { items: [] }

  if (non_fungible_resources.items.length === 0) {
    return []
  }

  const addresses = non_fungible_resources.items.map(
    (nft) => nft.resource_address
  )

  const addName = (entity: StateEntityDetailsResponse) =>
    entity.items.map((item) => ({
      address: item.address,
      name: getMetadata('name')(item.metadata)
    }))

  const nonFungiblesWithNames = await getEntitiesDetails(addresses).then(
    addName
  )

  const vaults = await Promise.all(
    nonFungiblesWithNames.map(async ({ address }) => ({
      resource: address,
      vault: await (
        await getEntityNonFungibleVaults(selectedAccountAddress, address)
      ).items[0]!.vault_address
    }))
  )

  const nfts = await Promise.all(
    nonFungiblesWithNames.map(async (nft) => ({
      name: nft.name,
      ...(await getEntityNonFungibleIDs(
        selectedAccountAddress!,
        nft.address,
        vaults.find((vault) => vault.resource === nft.address)!.vault
      ))
    }))
  )

  return nfts.reduce(
    (prev, cur) => [
      ...prev,
      ...cur.items.map(({ non_fungible_id }) => ({
        address: cur.resource_address,
        id: non_fungible_id,
        name: cur.name
      }))
    ],
    [] as Array<{ address: string; id: string; name: string | undefined }>
  )
}

export const createBadge = (accountAddress: string) =>
  sendTransaction(getCreateBadgeManifest(accountAddress))
