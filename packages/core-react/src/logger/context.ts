import type { LoggerService } from '@city/core'
import { createContext } from 'react'

export const LoggerContext = createContext<LoggerService<any> | null>(null)
