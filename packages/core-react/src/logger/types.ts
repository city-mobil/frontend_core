import type { LoggerService } from '@city/core'
import { Location } from 'history'

import { LOGGER_DATA_ATTRIBUTE_NAME } from './constants'

export type GetDataFromLocationFn<T> = (location: Location) => T | null

export interface UseLogger {
  loggerService: LoggerService<any> | null
}

export interface UseLoggerAttributeReturn {
  [LOGGER_DATA_ATTRIBUTE_NAME]: string
}
