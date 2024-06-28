import { createObservableHook } from '../../helpers/create-observable-hook'
import { DataRequestState } from '@common/rdt'
import { dataRequestStateModule } from '../rdt'

export const useDataRequestState = createObservableHook<DataRequestState>(
  dataRequestStateModule.state$,
  {}
)
