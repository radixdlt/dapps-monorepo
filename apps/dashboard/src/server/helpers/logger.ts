import { Logger } from 'tslog'
import { config } from '../config'

export type AppLogger = typeof appLogger
export const appLogger = new Logger({ minLevel: config.minLogLevel })
