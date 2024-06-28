import { hash } from '@utils'
import { http } from '@common/http'
import {
  accessRuleToManifestSyntax,
  type AccessRule,
  OwnerAccessRuleUpdatable
} from '../../../helpers/simple-access-rule-builder'

export const getDeployPackageManifest = (
  wasm: string,
  packageDefinition: string,
  accessRule: AccessRule,
  ownerAccessRuleUpdatable: OwnerAccessRuleUpdatable
) => {
  const wasmHash: string = hash(wasm).toString('hex')

  const transactionManifest = `
    PUBLISH_PACKAGE_ADVANCED
      ${accessRuleToManifestSyntax(accessRule, ownerAccessRuleUpdatable)}
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
