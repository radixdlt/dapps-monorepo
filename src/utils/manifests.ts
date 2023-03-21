import { ManifestBuilder } from '@radixdlt/radix-dapp-toolkit'

export const setMetadataAuth = (
  entity: string,
  resourceAddress: string,
  id: string
) => `
    SET_METHOD_ACCESS_RULE
        Address("${entity}")
        Tuple(Enum(2u8), "set")
        Enum(2u8, Enum(0u8, Enum(0u8, Enum(
            "SoftResourceOrNonFungible::StaticNonFungible", 
            NonFungibleGlobalId(
                "${resourceAddress}:${id}"
            )
        ))));
    `

export const createProof = (dappDefinition: string, badge: string) => `
    CALL_METHOD
        Address("${dappDefinition}")
        "create_proof_by_ids"
        Address("${badge.split(':')[0]}")
        Array<NonFungibleLocalId>(NonFungibleLocalId("${badge.split(':')[1]}"));
  `

const allowAll = `
SET_METHOD_ACCESS_RULE
    Address("resource_sim1qxntya3nlyju8zsj8h86fz8ma5yl8smwjlg9tckkqvrsxhzgyn")
    Tuple(Enum(2u8), "set")
    Enum("AccessRule::AllowAll");
`

/*
SET_METHOD_ACCESS_RULE
    Address("resource_sim1qxntya3nlyju8zsj8h86fz8ma5yl8smwjlg9tckkqvrsxhzgyn")
    Tuple(Enum("NodeModuleId::SELF"), "set")
    Enum("AccessRule::AllowAll");
    */
