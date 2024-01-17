import { createObservableHook } from '../helpers/create-observable-hook'
import { dataRequestStateClient } from '../rdt/rdt'
import { DataRequestState } from '@common/utils/rdt'

export const useDataRequestState = createObservableHook<DataRequestState>(
  dataRequestStateClient.state$,
  {}
)
