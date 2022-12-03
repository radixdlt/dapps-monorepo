/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function information(a: number): number;
export function convert_manifest(a: number): number;
export function compile_transaction_intent(a: number): number;
export function compile_signed_transaction_intent(a: number): number;
export function compile_notarized_transaction_intent(a: number): number;
export function decompile_transaction_intent(a: number): number;
export function decompile_signed_transaction_intent(a: number): number;
export function decompile_notarized_transaction_intent(a: number): number;
export function decompile_unknown_transaction_intent(a: number): number;
export function derive_non_fungible_address(a: number): number;
export function derive_non_fungible_address_from_public_key(a: number): number;
export function derive_virtual_account_address(a: number): number;
export function encode_address(a: number): number;
export function decode_address(a: number): number;
export function sbor_encode(a: number): number;
export function sbor_decode(a: number): number;
export function toolkit_alloc(a: number): number;
export function toolkit_free(a: number, b: number): void;
export function toolkit_free_c_string(a: number): void;
export function scrypto_alloc(a: number): number;
export function scrypto_free(a: number): void;
export function rustsecp256k1_v0_6_1_context_create(a: number): number;
export function rustsecp256k1_v0_6_1_context_destroy(a: number): void;
export function rustsecp256k1_v0_6_1_default_illegal_callback_fn(a: number, b: number): void;
export function rustsecp256k1_v0_6_1_default_error_callback_fn(a: number, b: number): void;
