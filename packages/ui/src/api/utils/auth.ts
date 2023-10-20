import type {
  ComponentEntityRoleAssignmentEntry,
  ComponentEntityRoleAssignments
} from '@radixdlt/babylon-gateway-api-sdk'

export type AuthRule = {
  type: 'protected'
  proof_rule: {
    type: 'require'
    requirement: {
      type: 'NonFungible'
      non_fungible: {
        local_id: {
          id_type: 'Bytes'
          sbor_hex: string
          simple_rep: string
        }
        resource_address: string
      }
    }
  }
}

type AccessRule = 'AllowAll' | 'DenyAll' | 'Owner' | AuthRule

export type AuthInfo = {
  owner: AccessRule
  rules: {
    [key: string]: {
      rule: AccessRule
      updaters: string[]
    }
  }
}

const isExplicitAccessRule = (accessRule: AccessRule): accessRule is AuthRule =>
  accessRule !== 'AllowAll' &&
  accessRule !== 'DenyAll' &&
  accessRule !== 'Owner'

export const isAllowed =
  (authInfo: AuthInfo) =>
  (rule: AuthInfo['rules'][keyof AuthInfo['rules']]) => {
    if (isExplicitAccessRule(rule.rule)) {
      return 'by-someone'
    }

    if (rule.rule === 'AllowAll') {
      return 'by-anyone'
    }

    if (rule.rule === 'Owner') {
      const owner = authInfo.owner

      if (isExplicitAccessRule(owner)) {
        return 'by-someone'
      }

      if (owner === 'AllowAll') {
        return 'by-anyone'
      }
    }

    return 'by-no-one'
  }

const getEntryInfo = (entry: ComponentEntityRoleAssignmentEntry) => {
  const assignment =
    entry.assignment.resolution === 'Explicit'
      ? (entry.assignment.explicit_rule as any).type === 'DenyAll' ||
        (entry.assignment.explicit_rule as any).type === 'AllowAll'
        ? ((entry.assignment.explicit_rule as any).type as AccessRule)
        : (entry.assignment.explicit_rule as any).access_rule
      : entry.assignment.resolution

  return {
    roleKey: entry.role_key.name,
    assignment,
    updaterRoles: entry.updater_roles?.map((role) => role.name) || []
  }
}

export const getAuthInfo = (
  auth: ComponentEntityRoleAssignments
): AuthInfo => ({
  owner:
    (auth.owner as any).rule.type === 'AllowAll' ||
    (auth.owner as any).rule.type === 'DenyAll'
      ? ((auth.owner as any).rule.type as AccessRule)
      : ((auth.owner as any).rule as AuthRule),
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
