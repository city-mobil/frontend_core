import { GetLoggerDataFn, LoggerService } from '@city/core'
import { History } from 'history'
import { useCallback, useContext, useEffect, useMemo } from 'react'

import { LOGGER_DATA_ATTRIBUTE_NAME } from './constants'
import { LoggerContext } from './context'
import type { GetDataFromLocationFn, UseLogger, UseLoggerAttributeReturn } from './types'

const getWarningMessage = (message: string): string => `[Logger-service] ${message}`

const warnInDevMode = (analyticsService: LoggerService<any> | null, el?: Element | null, name = ''): void => {
  if (process.env.NODE_ENV !== 'development') return

  if (!analyticsService) {
    console.warn(getWarningMessage('Cannot find logger service in context.'))

    return
  }

  if (name && !el) {
    console.warn(getWarningMessage(`Cannot find element with data attribute "logger-${name}".`))

    return
  }
}

export const useLogger = (): UseLogger => {
  const loggerService = useContext(LoggerContext)

  return { loggerService }
}

const defaultGetExtraData = <T>(): T => ({} as T)

export const useLoggerAttribute = <T>(
  name: string,
  getExtraData: GetLoggerDataFn<T> = defaultGetExtraData,
  event: keyof HTMLElementEventMap = 'click',
  options?: boolean | AddEventListenerOptions,
): UseLoggerAttributeReturn => {
  const attribute = useMemo(() => ({ [LOGGER_DATA_ATTRIBUTE_NAME]: name }), [name])
  const { loggerService } = useLogger()
  const callback = useCallback(() => loggerService?.pushToQueue(getExtraData), [loggerService, getExtraData])

  useEffect(() => {
    const el = document.querySelector(`[${LOGGER_DATA_ATTRIBUTE_NAME}=${name}]`)

    warnInDevMode(loggerService, el, name)

    if (!el || !loggerService) return

    el.addEventListener(event, callback, options)

    return (): void => {
      el.removeEventListener(event, callback, options)
    }
  }, [loggerService, callback, event, name, options])

  return attribute
}

export const usePageLogger = <T>(history: History, getDataFromLocation: GetDataFromLocationFn<T>): void => {
  const { loggerService } = useLogger()

  useEffect(() => {
    warnInDevMode(loggerService)

    if (!loggerService) return

    const data = getDataFromLocation(history.location)

    if (data) {
      loggerService.pushToQueue(() => data)
    }

    const dispouse = history.listen((location) => {
      const data = getDataFromLocation(location)

      if (!data) return

      loggerService.pushToQueue(() => data)
    })

    return (): void => {
      dispouse()
    }
  }, [loggerService, getDataFromLocation, history])
}
