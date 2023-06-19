export const getSendTokenManifest = (
  resource: string,
  fromAccount: string,
  toAccount: string,
  amount: number
) =>
  `
      CALL_METHOD 
        Address("${fromAccount}") 
        "withdraw"
        Address("${resource}")
        Decimal("${amount}");  
        
      TAKE_FROM_WORKTOP_BY_AMOUNT
        Decimal("${amount}")
        Address("${resource}")
        Bucket("bucket");
    
      CALL_METHOD
        Address("${toAccount}") 
        "deposit"
        Bucket("bucket");
    `

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

      TAKE_FROM_WORKTOP_BY_IDS 
        Array<NonFungibleLocalId>(NonFungibleLocalId("${cur.id}"))
        Address("${cur.resourceAddress}")
        Bucket("nft${i}");

      CALL_METHOD
        Address("${toAccount}")
        "deposit"
        Bucket("nft${i}");
        ` + prev,
      ``
    )}
  `
