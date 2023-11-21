import { hash } from '@utils'
import { http } from '@common/http'
import { createLogger } from '@radixdlt/radix-dapp-toolkit'
import {
  accessRuleToManifestSyntax,
  type AccessRule
} from '../../../helpers/simple-access-rule-builder'

export const getDeployPackageManifest = (
  wasm: string,
  packageDefinition: string,
  accessRule: AccessRule
) => {
  const wasmHash: string = hash(wasm).toString('hex')

  const transactionManifest = `
    PUBLISH_PACKAGE_ADVANCED
      ${accessRuleToManifestSyntax(accessRule)}
      ${packageDefinition}                    
      Blob("${wasmHash}")          
      Map<String, Tuple>()
      None         
    ;
    `
  return transactionManifest
}

export const sborDecodeSchema = async (schema: string) =>
  http
    .post('api/ret/sbor-decode', {
      hexEncodedSchema: schema
    })
    .then((res): string => res.decodedString)
