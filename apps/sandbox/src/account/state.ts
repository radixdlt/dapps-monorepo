import { BehaviorSubject } from 'rxjs'
import { createObservableHook } from '../helpers/create-observable-hook'
import { addEntities } from '../entity/state'
import { Account } from '@common/rdt'

const accounts = new BehaviorSubject<Account[]>([])

export const setAccounts = (input: Account[]) => {
  accounts.next(input)
  addEntities(input.map((item) => ({ address: item.address, type: 'account' })))
}

export const useAccounts = createObservableHook(accounts, [])
