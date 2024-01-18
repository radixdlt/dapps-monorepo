export const getSendTokenManifest = (
  resource: string,
  fromAccount: string,
  toAccount: string,
  amount: number
) => {
  const manifest = `
CALL_METHOD 
  Address("${fromAccount}") 
  "withdraw"
  Address("${resource}")
  Decimal("${amount}");
 
TAKE_FROM_WORKTOP
  Address("${resource}")
  Decimal("${amount}")
  Bucket("bucket");

CALL_METHOD
  Address("${toAccount}") 
  "try_deposit_or_abort"
  Bucket("bucket")
  Enum<0u8>();`
  console.log(manifest)
  return manifest
}

export const getSendNFTManifest = (
  nfts: {
    resourceAddress: string
    id: string
  }[],
  fromAccount: string,
  toAccount: string
) => `
    ${nfts.reduce(
      (prev, cur, i) =>
        `
      CALL_METHOD 
        Address("${fromAccount}") 
        "withdraw_non_fungibles"
        Address("${cur.resourceAddress}")
        Array<NonFungibleLocalId>(NonFungibleLocalId("${cur.id}"));

      TAKE_NON_FUNGIBLES_FROM_WORKTOP 
        Address("${cur.resourceAddress}")
        Array<NonFungibleLocalId>(NonFungibleLocalId("${cur.id}"))
        Bucket("nft${i}");

      CALL_METHOD
        Address("${toAccount}")
        "try_deposit_or_abort"
        Bucket("nft${i}")
        Enum<0u8>();
        ` + prev,
      ``
    )}
  `

export const createBadgeProof = (badgeAddresses: string[], address: string) => {
  const transactionManifest: string[] = []

  for (const badgeAddress of badgeAddresses) {
    const isNonFungible = badgeAddress.includes(':')
    const [resourceAddress, id] = badgeAddress.split(':')

    transactionManifest.push(
      isNonFungible
        ? `
        CALL_METHOD
          Address("${address}")
          "create_proof_of_non_fungibles"
          Address("${resourceAddress}")
          Array<NonFungibleLocalId>(NonFungibleLocalId("${id}"))
        ;
        `
        : `
        CALL_METHOD
          Address("${address}")
          "create_proof_of_amount"
          Address("${badgeAddress}")
          Decimal("1")
        ;
        `
    )
  }
  console.log(transactionManifest)
  return transactionManifest.join(' ')
}
