export type GetLoggerDataFn<T> = () => T
export type OnSendCallbackFn<T> = (logs: T[], meta: Record<string, any>) => Promise<void>
export type FilterFn<T> = (log: T) => boolean

export interface LoggerServiceParams<BodyItem> {
  flushLogsInterval?: number
  batchSize?: number
  getBaseData?: GetLoggerDataFn<BodyItem>
  getMeta?: () => Record<string, any>
  onErrorCallback?: (error: any) => void
  onSendCallback: OnSendCallbackFn<BodyItem>
}
