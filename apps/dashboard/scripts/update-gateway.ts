import { $RefParser } from '@apidevtools/json-schema-ref-parser'
import fs from 'fs'
import { JSONSchemaFaker } from 'json-schema-faker'
import { NETWORK_CONFIG } from '../src/constants.js'
import request from 'request'
import child_process from 'child_process'

if (!process.env.PUBLIC_NETWORK_NAME) {
  console.error(
    'ERROR: Please specify a network to update the gateway mocks for'
  )
  process.exit(1)
}

child_process.execSync('yarn add @radixdlt/babylon-gateway-api-sdk')

const GATEWAY_SCHEMA_URL = `${
  NETWORK_CONFIG[process.env.PUBLIC_NETWORK_NAME]!.url
}/gateway-api-schema.json`

JSONSchemaFaker.option({
  alwaysFakeOptionals: true,
  useExamplesValue: true,
  minItems: 3
})

const fakeResponse = (schema: any) => (path: string) => {
  const method = schema.paths[path].post
  return JSONSchemaFaker.generate(
    method.responses['200'].content['application/json'].schema as any,
    {}
  )
}

request(GATEWAY_SCHEMA_URL, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const schema = JSON.parse(body)

    // resolve all $ref pointers in the schema so that it can be parsed by the faker
    $RefParser.dereference(schema, (err, _schema) => {
      if (err) {
        console.error(err)
        return
      }
      let mocks: any = {}
      Object.keys((_schema as any).paths).forEach((path) => {
        mocks[path] = fakeResponse(_schema)(path)
      })
      fs.writeFile(`src/api/mocks.json`, JSON.stringify(mocks), () => {})
    })
  }
})
