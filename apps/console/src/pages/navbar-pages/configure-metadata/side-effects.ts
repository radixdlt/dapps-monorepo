export const createBadgeProof = (
  proofs: {
    resource?: {
      account?: string
      address?: string
      ids?: string[]
      name?: string
    }
    nftId?: string
  }[]
) => {
  const transactionManifest: string[] = []

  for (const proof of proofs) {
    if (!proof.resource || !proof.resource.account || !proof.resource.ids)
      continue

    const isNonFungible = proof.resource.ids.length > 0

    transactionManifest.push(
      isNonFungible
        ? `
        CALL_METHOD
          Address("${proof.resource.account}")
          "create_proof_of_non_fungibles"
          Address("${proof.resource.address}")
          Array<NonFungibleLocalId>(NonFungibleLocalId("${
            proof.nftId === 'any' ? proof.resource.ids[0] : proof.nftId
          }"))
        ;
        `
        : `
        CALL_METHOD
          Address("${proof.resource.account}")
          "create_proof_of_amount"
          Address("${proof.resource.address}")
          Decimal("1")
        ;
        `
    )
  }
  console.log(transactionManifest)
  return transactionManifest.join(' ')
}
