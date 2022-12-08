/* tslint:disable */
/* eslint-disable */

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly toolkit_alloc: (a: number) => number;
  readonly toolkit_free: (a: number, b: number) => void;
  readonly toolkit_free_c_string: (a: number) => void;
  readonly information: (a: number) => number;
  readonly convert_manifest: (a: number) => number;
  readonly compile_transaction_intent: (a: number) => number;
  readonly decompile_transaction_intent: (a: number) => number;
  readonly compile_signed_transaction_intent: (a: number) => number;
  readonly decompile_signed_transaction_intent: (a: number) => number;
  readonly compile_notarized_transaction_intent: (a: number) => number;
  readonly decompile_notarized_transaction_intent: (a: number) => number;
  readonly decompile_unknown_transaction_intent: (a: number) => number;
  readonly decode_address: (a: number) => number;
  readonly encode_address: (a: number) => number;
  readonly sbor_decode: (a: number) => number;
  readonly sbor_encode: (a: number) => number;
  readonly extract_abi: (a: number) => number;
  readonly derive_non_fungible_address_from_public_key: (a: number) => number;
  readonly derive_non_fungible_address: (a: number) => number;
  readonly rustsecp256k1_v0_5_0_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_5_0_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_5_0_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_5_0_default_error_callback_fn: (a: number, b: number) => void;
  readonly scrypto_alloc: (a: number) => number;
  readonly scrypto_free: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
