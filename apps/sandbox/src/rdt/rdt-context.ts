import { createContext } from 'react'
import { RadixDappToolkit } from '@common/rdt'

export type Rdt = ReturnType<typeof RadixDappToolkit>

export const RdtContext = createContext<Rdt | null>(null)
