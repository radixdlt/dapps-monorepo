export type AccessRule =
  | { type: 'allowAll' }
  | { type: 'none' }
  | { address: string; type: 'fungible' }
  | { address: string; type: 'nonFungible' }

export const accessRuleToManifestSyntax = (rule: AccessRule) => {
  switch (rule.type) {
    case 'allowAll':
      return `Enum<AccessRule::AllowAll>()`
    case 'none':
      return `None`
    case 'fungible':
      return `
        Enum<2u8>(
            Enum<2u8>(
                Enum<0u8>(
                    Enum<0u8>(
                        Enum<1u8>(
                            Address("${rule.address}")
                        )
                    )
                )
            )
        )
      `
    case 'nonFungible':
      return `
            Enum<2u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<0u8>(
                                NonFungibleGlobalId("${rule.address}")
                            )
                        )
                    )
                )
            )
        `

    default:
      break
  }
}
