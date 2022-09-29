import { Buffer } from 'buffer'

interface TransactionServiceInterface {
  information(requestStringPointer: number): number

  extract_abi(requestStringPointer: number): number

  __transaction_lib_alloc(capacity: number): number
  __transaction_lib_free(pointer: number): void
}

export type Request = ExtractAbiRequest

export interface ExtractAbiRequest {
  package_wasm: string
}

export interface ExtractAbiResponse {
  code: string
  abi: string
}

export class TransactionLibrary {
  private wasmModule: WebAssembly.Instance
  private internal_service: TransactionServiceInterface

  // =============
  // Constructors
  // =============

  constructor(wasmModule: WebAssembly.Instance) {
    this.wasmModule = wasmModule
    this.internal_service =
      wasmModule.exports as unknown as TransactionServiceInterface
  }

  static async fromWasmModuleBuffer(
    buffer: Uint8Array
  ): Promise<TransactionLibrary> {
    const wasmImports: WebAssembly.Imports = {
      env: {
        memory: new WebAssembly.Memory({
          initial: 1
        })
      }
    }
    const wasmModule: WebAssembly.WebAssemblyInstantiatedSource =
      await WebAssembly.instantiate(buffer, wasmImports)
    return new TransactionLibrary(wasmModule.instance)
  }

  // =================
  // Exported Methods
  // =================

  information(): any {
    return this.callWasmFunction({} as any, this.internal_service.information)
  }

  extract_abi(request: ExtractAbiRequest): ExtractAbiResponse {
    return this.callWasmFunction(request, this.internal_service.extract_abi)
  }

  private callWasmFunction<T>(
    request: Request,
    wasmFunction: (requestStringPointer: number) => number
  ): T {
    // Serialize the request as JSON and write it to WASM's memory
    const requestStringPointer: number = this.writeString(
      JSON.stringify(request)
    )

    // Call the method on the WASM module
    const responsePointer: number = wasmFunction(requestStringPointer)

    // Read and parse the returned response
    const returnedString: string = this.readString(responsePointer)
    const parsedResponse: T = JSON.parse(returnedString)

    // Free up the memory needed in this operation
    this.internal_service.__transaction_lib_free(requestStringPointer)
    this.internal_service.__transaction_lib_free(responsePointer)

    return parsedResponse
  }

  // ===============
  // Helper Methods
  // ===============

  private readString(pointer: number): string {
    // @ts-ignore
    const memoryBuffer: Uint8Array = this.wasmModule.exports.memory.buffer

    const view: Uint8Array = new Uint8Array(memoryBuffer, pointer)
    const length: number = view.findIndex((byte) => byte === 0)
    const decoder: TextDecoder = new TextDecoder()

    return decoder.decode(new Uint8Array(memoryBuffer, pointer, length))
  }

  private writeString(string: string): number {
    const pointer: number = this.allocateMemory(string)

    // @ts-ignore
    const memoryBuffer: Uint8Array = this.wasmModule.exports.memory.buffer

    const view: Uint8Array = new Uint8Array(memoryBuffer, pointer)
    const encoder: TextEncoder = new TextEncoder()
    view.set(
      Uint8Array.from(
        Buffer.concat([
          Buffer.from(encoder.encode(string)),
          Buffer.from(new Uint8Array([0]))
        ])
      )
    )

    return pointer
  }

  private allocateMemory(string: string): number {
    // Take the string and convert it into a byte array to determine its length
    const byteArray: Uint8Array = new TextEncoder().encode(string)
    const pointer: number = this.internal_service.__transaction_lib_alloc(
      byteArray.length + 1
    )
    return pointer
  }
}

export const createTransactionService =
  async (): Promise<TransactionLibrary> => {
    const rawResponse: Response = await fetch('./src/transaction_library.wasm')
    const blob: ArrayBuffer = await rawResponse.arrayBuffer()
    return TransactionLibrary.fromWasmModuleBuffer(Buffer.from(blob))
  }
