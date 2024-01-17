import type { ResultAsync } from 'neverthrow';
import type { ErrorResponse } from '@common/utils/gateway-sdk';
export declare const handleGatewayResult: (errorMessage?: ((e: ErrorResponse) => string) | undefined) => <T, E extends ErrorResponse>(result: ResultAsync<T, E>) => Promise<T>;
export declare const addressToRoute: (address: string) => Promise<string>;
