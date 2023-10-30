import type {
  ComponentEntityRoleAssignmentEntry,
  ComponentEntityRoleAssignments
} from '@radixdlt/babylon-gateway-api-sdk'

export type AccessRule =
  | ProtectedAccessRule
  | AllowAllAccessRule
  | DenyAllAccessRule
  | OwnerAccessRule

type AccessRuleNode =
  | ProofAccessRuleNode
  | AnyOfAccessRuleNode
  | AllOfAccessRuleNode

type ProofRule =
  | RequireProofRule
  | AmountOfProofRule
  | AllOfProofRule
  | AnyOfProofRule
  | CountOfProofRule

type Requirement = ResourceRequirement | NonFungibleRequirement

type ResourceRequirement = {
  type: 'Resource'
  resource: string
}

type NonFungibleRequirement = {
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

type RequireProofRule = {
  type: 'Require'
  requirement: Requirement
}

type AmountOfProofRule = {
  type: 'AmountOf'
  amount: string
  resource: string
}

type AllOfProofRule = {
  type: 'AllOf'
  list: Requirement[]
}

type AnyOfProofRule = {
  type: 'AnyOf'
  list: Requirement[]
}

type CountOfProofRule = {
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
  const rule = assignment.explicit_rule as AccessRule | undefined

  const roleKey = entry.role_key.name
  const updaterRoles = entry.updater_roles?.map((role) => role.name) || []

  if (rule) {
    if (rule.type === 'AllowAll' || rule.type === 'DenyAll') {
      return {
        roleKey,
        assignment: rule,
        updaterRoles
      }
    } else {
      return {
        roleKey,
        assignment: rule,
        updaterRoles
      }
    }
  } else {
    return {
      roleKey,
      assignment: { type: 'Owner' as const },
      updaterRoles
    }
  }
}

export const getAuthInfo = (
  auth: ComponentEntityRoleAssignments
): AuthInfo => ({
  owner:
    (auth.owner as any).rule.type === 'AllowAll' ||
    (auth.owner as any).rule.type === 'DenyAll'
      ? ((auth.owner as any).rule.type as AccessRule)
      : ((auth.owner as any).rule as AccessRule),
  rules: auth.entries.map(getEntryInfo).reduce(
    (acc, entry) => ({
      ...acc,
      [entry.roleKey]: {
        rule: entry.assignment,
        updaters: entry.updaterRoles
      }
    }),
    {} as AuthInfo['rules']
  )
})
