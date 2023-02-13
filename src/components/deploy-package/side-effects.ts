import {
  getEntityDetails,
  getEntityNonFungibleIDs,
  getEntityResources,
  getTransactionDetails
} from '@api/gateway'
import { sendTransaction } from '@api/wallet'
import { hash } from '@utils'

export const getCreateBadgeManifest = (accountAddress: string) => `
  CREATE_NON_FUNGIBLE_RESOURCE 
      Enum("NonFungibleIdType::Integer") 
      Map<String, String>(
          "name", "My Package Owner Badge", 
          "description", "This NFT was created by the Radix Dashboard as a simple badge to be used for default package control permissions. There is nothing special about it - swap it out, or create your own"
      ) 
      Map<Enum, Tuple>(
          Enum("ResourceMethodAuthKey::Withdraw"), Tuple(Enum("AccessRule::AllowAll"), Enum("AccessRule::DenyAll")),
          Enum("ResourceMethodAuthKey::Deposit"), Tuple(Enum("AccessRule::AllowAll"), Enum("AccessRule::DenyAll"))
      )
      Some(
        Map<NonFungibleLocalId, Tuple>(
            NonFungibleLocalId("#1#"), 
            Tuple(
                Tuple("Hello World", Decimal("12")),        
                Tuple(12u8, 19u128)                         
            )
        )
    );
  CALL_METHOD
      ComponentAddress("${accountAddress}") 
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
  const { nonFungible } = await getEntityResources(selectedAccountAddress)
  if (!nonFungible) return []

  const nonFungiblesWithNames = await Promise.all(
    nonFungible.map(async (nft) => ({
      ...nft,
      name: await getEntityDetails(nft.address).then(
        (response) =>
          response.metadata.items.find((item) => item.key === 'name')?.value
      )
    }))
  )

  const nfts = await Promise.all(
    nonFungiblesWithNames.map(async (nft) => ({
      name: nft.name,
      ...(await getEntityNonFungibleIDs(selectedAccountAddress!, nft.address))
    }))
  )

  return nfts.reduce(
    (prev, cur) => [
      ...prev,
      ...cur.non_fungible_ids.items.map(({ non_fungible_id }) => ({
        address: cur.resource_address,
        id: non_fungible_id,
        name: cur.name
      }))
    ],
    [] as Array<{ address: string; id: string; name: string | undefined }>
  )
}

export const deploy = async (
  wasm: string,
  abi: string,
  selectedAccountAddress: string,
  { address, id }: { address: string; id: string }
) => {
  return sendTransaction(
    getDeployPackageManifest(wasm, abi, selectedAccountAddress, address, id),
    [wasm, abi]
  )
    .then(async ({ transactionIntentHash }) => ({
      txID: transactionIntentHash,
      entities: (await getTransactionDetails(transactionIntentHash))
        .createdEntities,
      badgeMetadata: (await getEntityDetails(address)).metadata.items
    }))
    .then((result) => ({
      ...result,
      badgeName: result.badgeMetadata.find(({ key }) => key === 'name')?.value,
      badgeMetadata: result.badgeMetadata.filter(({ key }) => key !== 'name')
    }))
}

export const createBadge = (accountAddress: string) =>
  sendTransaction(getCreateBadgeManifest(accountAddress))
