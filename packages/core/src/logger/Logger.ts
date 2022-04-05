import { LOGGER_BATCH_SIZE, LOGGER_FLUSH_LOGS_INTERVAL } from './constants'
import { FilterFn, GetLoggerDataFn, LoggerServiceParams } from './types'

const defaultOnError = (): void => {
  // nothing
}

const defaultGetData = <T>(): T => ({} as T)

export class LoggerService<BodyItem> {
  private queue: BodyItem[] = []
  private interval: ReturnType<typeof setInterval> | null = null
  private readonly getBaseData
  private flushLogsInterval
  private readonly onErrorCallback
  private readonly onSendCallback
  private readonly batchSize
  private readonly getMeta

  constructor(params: LoggerServiceParams<BodyItem>) {
    const {
      flushLogsInterval = LOGGER_FLUSH_LOGS_INTERVAL,
      batchSize = LOGGER_BATCH_SIZE,
      getBaseData = defaultGetData,
      onErrorCallback = defaultOnError,
      getMeta = defaultGetData,
      onSendCallback,
    } = params

    this.getBaseData = getBaseData
    this.flushLogsInterval = flushLogsInterval
    this.onSendCallback = onSendCallback
    this.onErrorCallback = onErrorCallback
    this.batchSize = batchSize
    this.getMeta = getMeta
  }

  pushToQueue(getExtraData: GetLoggerDataFn<BodyItem>): void {
    const baseData = this.getBaseData()
    const extraData = getExtraData()

    this.queue.push({ ...baseData, ...extraData })
  }

  async flushLogs(): Promise<void> {
    if (this.queue.length === 0) return

    try {
      await this.onSendCallback(this.queue.slice(0, this.batchSize), this.getMeta())

      this.queue = this.queue.slice(this.batchSize)
    } catch (e) {
      this.onErrorCallback(e)
    }
  }

  startFlushLogs(): void {
    this.interval = setInterval(() => {
      void this.flushLogs()
    }, this.flushLogsInterval)
  }

  stopFlushLogs(): void {
    if (!this.interval) return

    clearInterval(this.interval)
  }

  setFlushLogsInterval(timeout: number): void {
    this.flushLogsInterval = timeout
  }

  clearQueue(filterFn?: FilterFn<BodyItem>): void {
    if (filterFn) {
      this.queue = this.queue.filter(filterFn)
    } else {
      this.queue = []
    }
  }
}
