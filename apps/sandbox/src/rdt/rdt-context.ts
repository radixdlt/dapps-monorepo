import { createContext } from 'react'
import { RadixDappToolkit } from '@common/utils/rdt'

export type Rdt = ReturnType<typeof RadixDappToolkit>

export const RdtContext = createContext<Rdt | null>(null)
