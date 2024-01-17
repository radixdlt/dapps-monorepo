import type { ComponentEntityRoleAssignments } from '@radixdlt/babylon-gateway-api-sdk';
export type AccessRule = ProtectedAccessRule | AllowAllAccessRule | DenyAllAccessRule | OwnerAccessRule;
export type AccessRuleNode = ProofAccessRuleNode | AnyOfAccessRuleNode | AllOfAccessRuleNode;
export type ProofRule = RequireProofRule | AmountOfProofRule | AllOfProofRule | AnyOfProofRule | CountOfProofRule;
export type Requirement = ResourceRequirement | NonFungibleRequirement;
export type ResourceRequirement = {
    type: 'Resource';
    resource: string;
};
export type NonFungibleRequirement = {
    type: 'NonFungible';
    non_fungible: {
        resource_address: string;
        local_id: {
            id_type: string;
            sbor_hex: string;
            simple_rep: string;
        };
    };
};
export type RequireProofRule = {
    type: 'Require';
    requirement: Requirement;
};
export type AmountOfProofRule = {
    type: 'AmountOf';
    amount: string;
    resource: string;
};
export type AllOfProofRule = {
    type: 'AllOf';
    list: Requirement[];
};
export type AnyOfProofRule = {
    type: 'AnyOf';
    list: Requirement[];
};
export type CountOfProofRule = {
    type: 'CountOf';
    count: number;
    list: Requirement[];
};
type ProofAccessRuleNode = {
    type: 'ProofRule';
    proof_rule: ProofRule;
};
type AnyOfAccessRuleNode = {
    type: 'AnyOf';
    access_rules: AccessRuleNode[];
};
type AllOfAccessRuleNode = {
    type: 'AllOf';
    access_rules: AccessRuleNode[];
};
export type ProtectedAccessRule = {
    type: 'Protected';
    access_rule: AccessRuleNode;
};
type AllowAllAccessRule = {
    type: 'AllowAll';
};
type DenyAllAccessRule = {
    type: 'DenyAll';
};
type OwnerAccessRule = {
    type: 'Owner';
};
export type AuthInfo = {
    owner: AccessRule;
    rules: {
        [key: string]: {
            rule: AccessRule;
            updaters: string[];
        };
    };
};
export declare const isAllowed: (authInfo: AuthInfo) => (rule: AuthInfo['rules'][keyof AuthInfo['rules']]) => "by-someone" | "by-anyone" | "by-no-one";
export declare const getAuthInfo: (auth: ComponentEntityRoleAssignments) => AuthInfo;
export {};
