import type { ObjectModuleId } from '@common/gateway-sdk'
import type {
  ComponentEntityRoleAssignmentEntry,
  ComponentEntityRoleAssignments
} from '@common/gateway-sdk'

export type AccessRule =
  | ProtectedAccessRule
  | AllowAllAccessRule
  | DenyAllAccessRule
  | OwnerAccessRule

export type AccessRuleNode =
  | ProofAccessRuleNode
  | AnyOfAccessRuleNode
  | AllOfAccessRuleNode

export type ProofRule =
  | RequireProofRule
  | AmountOfProofRule
  | AllOfProofRule
  | AnyOfProofRule
  | CountOfProofRule

export type Requirement = ResourceRequirement | NonFungibleRequirement

export type ResourceRequirement = {
  type: 'Resource'
  resource: string
}

export type NonFungibleRequirement = {
  type: 'NonFungible'
  non_fungible: {
    resource_address: string
    local_id: {
      id_type: string
      sbor_hex: string
      simple_rep: string
    }
  }
}

export type RequireProofRule = {
  type: 'Require'
  requirement: Requirement
}

export type AmountOfProofRule = {
  type: 'AmountOf'
  amount: string
  resource: string
}

export type AllOfProofRule = {
  type: 'AllOf'
  list: Requirement[]
}

export type AnyOfProofRule = {
  type: 'AnyOf'
  list: Requirement[]
}

export type CountOfProofRule = {
  type: 'CountOf'
  count: number
  list: Requirement[]
}

type ProofAccessRuleNode = {
  type: 'ProofRule'
  proof_rule: ProofRule
}

type AnyOfAccessRuleNode = {
  type: 'AnyOf'
  access_rules: AccessRuleNode[]
}

type AllOfAccessRuleNode = {
  type: 'AllOf'
  access_rules: AccessRuleNode[]
}

export type ProtectedAccessRule = {
  type: 'Protected'
  access_rule: AccessRuleNode
}

type AllowAllAccessRule = {
  type: 'AllowAll'
}

type DenyAllAccessRule = {
  type: 'DenyAll'
}

type OwnerAccessRule = {
  type: 'Owner'
}

export type AuthInfo = {
  owner: AccessRule
  rules: {
    [key: string]: {
      module: ObjectModuleId
      rule: AccessRule
      updaters: string[]
    }
  }
}

export const isAllowed =
  (authInfo: AuthInfo) =>
  (rule: AuthInfo['rules'][keyof AuthInfo['rules']]) => {
    if (rule.rule.type === 'Protected') {
      return 'by-someone'
    }

    if (rule.rule.type === 'AllowAll') {
      return 'by-anyone'
    }

    if (rule.rule.type === 'Owner') {
      const owner = authInfo.owner

      if (owner.type == 'Protected') {
        return 'by-someone'
      }

      if (owner.type === 'AllowAll') {
        return 'by-anyone'
      }
    }

    return 'by-no-one'
  }

const getEntryInfo = (entry: ComponentEntityRoleAssignmentEntry) => {
  const assignment = entry.assignment
  const rule =
    assignment.resolution === 'Explicit' &&
    (assignment.explicit_rule as AccessRule | undefined)

  const roleKey = entry.role_key.name
  const module = entry.role_key.module
  const updaterRoles = entry.updater_roles?.map((role) => role.name) || []

  return {
    roleKey,
    module,
    assignment: rule ? rule : { type: 'Owner' as const },
    updaterRoles
  }
}

export const getAuthInfo = (
  auth: ComponentEntityRoleAssignments
): AuthInfo => ({
  owner: (auth.owner as any).rule as AccessRule,
  rules: auth.entries.map(getEntryInfo).reduce(
    (acc, entry) => ({
      ...acc,
      [entry.roleKey]: {
        module: entry.module,
        rule: entry.assignment,
        updaters: entry.updaterRoles
      }
    }),
    {} as AuthInfo['rules']
  )
})
