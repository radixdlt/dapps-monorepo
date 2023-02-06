import {
  getEntityDetails,
  getEntityNonFungibleIDs,
  getEntityResources,
  getTransactionDetails
} from '@api/gateway'
import { sendTransaction } from '@api/wallet'
import { hash } from '@utils'

export const getCreateBadgeManifest = (accountAddress: string) => `
  CREATE_RESOURCE 
      Enum(
          "NonFungible", 
          Enum("U32")
      ) 
      Array<Tuple>(
          Tuple("name", "My Package Owner Badge"), 
          Tuple("description", "This NFT was created by the Radix Dashboard as a simple badge to be used for default package control permissions. There is nothing special about it - swap it out, or create your own"), 
      ) 
      Array<Tuple>(
          Tuple(Enum("Withdraw"), Tuple(Enum("AllowAll"), Enum("DenyAll"))),
          Tuple(Enum("Deposit"), Tuple(Enum("AllowAll"), Enum("DenyAll")))
      )
      Some(
          Enum(
              "NonFungible", 
              Array<Tuple>(
                  Tuple(NonFungibleId(1u32), Tuple(Bytes("5c2100"), Bytes("5c2100")))
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
  nftAddress: string
) => {
  const codeHash: string = hash(wasm).toString('hex')
  const abiHash: string = hash(abi).toString('hex')
  return `
      PUBLISH_PACKAGE_WITH_OWNER 
        Blob("${codeHash}") 
        Blob("${abiHash}")
        NonFungibleAddress("${nftAddress}", 1u32);

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
  selectedNftAddress: string
) => {
  return sendTransaction(
    getDeployPackageManifest(
      wasm,
      abi,
      selectedAccountAddress,
      selectedNftAddress
    ),
    [wasm, abi]
  )
    .then(async ({ transactionIntentHash }) => ({
      txID: transactionIntentHash,
      entities: (await getTransactionDetails(transactionIntentHash))
        .createdEntities,
      badgeMetadata: (await getEntityDetails(selectedNftAddress)).metadata.items
    }))
    .then((result) => ({
      ...result,
      badgeName: result.badgeMetadata.find(({ key }) => key === 'name')?.value,
      badgeMetadata: result.badgeMetadata.filter(({ key }) => key !== 'name')
    }))
}

export const createBadge = (accountAddress: string) =>
  sendTransaction(getCreateBadgeManifest(accountAddress))
