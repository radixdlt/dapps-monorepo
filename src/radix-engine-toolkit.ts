import init from 'radix_engine_toolkit'
import type { InitOutput } from 'radix_engine_toolkit'

type DecompileUnknownTransactionIntentRequest = {
  manifest_instructions_output_format: 'JSON' | 'String'
  compiled_unknown_intent: string
}

type DecompileUnknownTransactionIntentResponse = {
  signed_intent: {
    intent: {
      manifest: {
        instructions: {
          value: string
        }
      }
    }
  }
}

type IO = {
  [K in keyof WasmFunction]: WasmFunction[K] extends WasmFunction['decompile_transaction_intent']
    ? {
        request: DecompileUnknownTransactionIntentRequest
        response: DecompileUnknownTransactionIntentResponse
      }
    : never
}

type WasmFunction = {
  [K in keyof InitOutput as InitOutput[K] extends (a: number) => number
    ? K
    : never]: InitOutput[K]
}

const wasmInterface = (module: InitOutput) => {
  const allocateMemory = (string: string) => {
    // Take the string and convert it into a byte array to determine its length
    const byteArray: Uint8Array = new TextEncoder().encode(string)
    const pointer: number = module.toolkit_alloc(byteArray.length + 1)
    return pointer
  }

  const writeString = (string: string) => {
    const pointer: number = allocateMemory(string)

    const memoryBuffer = module.memory.buffer

    const view: Uint8Array = new Uint8Array(memoryBuffer, pointer)
    const encoder: TextEncoder = new TextEncoder()
    view.set(new Uint8Array([...encoder.encode(string), 0])) // Adding 0 at the end to be a c-style string

    return pointer
  }

  const readString = (pointer: number) => {
    const memoryBuffer = module.memory.buffer

    const view: Uint8Array = new Uint8Array(memoryBuffer, pointer)
    const length: number = view.findIndex((byte) => byte === 0)
    const decoder: TextDecoder = new TextDecoder()

    return decoder.decode(new Uint8Array(memoryBuffer, pointer, length))
  }

  return (wasmFunction: keyof WasmFunction) =>
    (request: IO[typeof wasmFunction]) => {
      // Serialize the request as JSON and write it to WASM's memory
      const requestStringPointer: number = writeString(JSON.stringify(request))

      // Call the method on the WASM module
      const responsePointer: number = module[wasmFunction](requestStringPointer)

      // Read and parse the returned response
      const returnedString: string = readString(responsePointer)
      const parsedResponse: IO[typeof wasmFunction]['request'] | Error =
        JSON.parse(returnedString)

      if (
        ((response: unknown): response is Error => !!(response as Error).cause)(
          parsedResponse
        )
      ) {
        throw parsedResponse
      }

      // Free up the memory needed in this operation
      module.toolkit_free_c_string(requestStringPointer)
      module.toolkit_free_c_string(responsePointer)

      return parsedResponse
    }
}

export const toolkit = () => {
  if (window) {
    return init(
      `${window.location.origin}/assets/radix_engine_toolkit_bg.wasm`
    ).then(wasmInterface)
  }
}
