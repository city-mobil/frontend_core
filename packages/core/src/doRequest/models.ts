import { AsyncDataStatus } from './enums'

/**
 * AsyncParticle. Частица стейта, содержащая в себе результат какого-либо асинхронного запроса.
 *
 * Data - Тип данных
 * Params - Параметры, которые были переданы в запрос.
 */
export interface AsyncParticle<Data, Params = unknown> {
  /** Статус запроса **/
  status: AsyncDataStatus
  /** Данные **/
  data: Data | null
  /** Ошибка **/
  error: Error | null
  /** Параметры, отправленные в запросе **/
  params: Params | null
  /** Время последнего апдейта data **/
  updatedAt: number
}

/**
 * Функция-запрос данных.
 */
export type AsyncRequest<Response> = () => Promise<Response>

/**
 * Функция для работы с асинхронными запросами.
 * Например, для реализации кейса "Повесить лоадер, сделать запрос, сохранить данные, убрать лоадер".
 */
export type DoRequestFn<Data, Params = unknown> = (
  /** @link AsyncParticle **/
  particle: AsyncParticle<Data, Params>,
  /** @link AsyncRequest **/
  request: AsyncRequest<Data>,
  /** Параметры, переданные в запрос **/
  params: AsyncParticle<Data, Params>['params'],
  /** Возможность переопределить внутреннюю логику **/
  override: DoRequestOverride<Data, Params>,
) => Promise<Data>

/**
 * Данные для оверрайда куска doRequest.
 */
export interface DoRequestOverrideData<Data, Params> {
  /** @link DoRequestFn **/
  particle: Parameters<DoRequestFn<Data, Params>>[0]
  /** @link DoRequestFn **/
  request: Parameters<DoRequestFn<Data, Params>>[1]
  /** @link DoRequestFn **/
  params: Parameters<DoRequestFn<Data, Params>>[2]
}

/**
 * Переопределение логики внутри doRequest.
 * @link DoRequestFn
 */
export interface DoRequestOverride<Data, Params> {
  /** Логика перед выполнением запроса **/
  before?: (data: DoRequestOverrideData<Data, Params>) => void
  /** Логика обработки успешного завершения вопроса **/
  success?: (data: DoRequestOverrideData<Data, Params>, response: Data) => void
  /** Логика обработки ошибочного завершения вопроса **/
  failed?: (data: DoRequestOverrideData<Data, Params>, error: unknown) => void
}
