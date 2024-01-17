import type { StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk';
import { type _Entity } from '.';
export type Package = _Entity<'package', ['name', 'description'], false>;
export declare let transformPackage: (entity: StateEntityDetailsVaultResponseItem) => Package;
