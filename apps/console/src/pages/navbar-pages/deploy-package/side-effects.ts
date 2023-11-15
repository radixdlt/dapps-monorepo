import { hash } from '@utils'
import { http } from '@common/http'
import { createLogger } from '@radixdlt/radix-dapp-toolkit'

export type AccessRule =
  | { type: 'allowAll' }
  | { type: 'none' }
  | { address: string; type: 'fungible' }
  | { address: string; type: 'nonFungible' }

const getAccessRule = (rule: AccessRule) => {
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

export const getDeployPackageManifest = (
  wasm: string,
  packageDefinition: string,
  accessRule: AccessRule
) => {
  const wasmHash: string = hash(wasm).toString('hex')

  const transactionManifest = `
    PUBLISH_PACKAGE_ADVANCED
      ${getAccessRule(accessRule)}
      ${packageDefinition}                    
      Blob("${wasmHash}")          
      Map<String, Tuple>()
      None         
    ;
    `
  createLogger(1).debug(transactionManifest)
  return transactionManifest
}

export const sborDecodeSchema = async (schema: string) =>
  http
    .post('api/ret/sbor-decode', {
      hexEncodedSchema: schema
    })
    .then((res): string => res.decodedString)
