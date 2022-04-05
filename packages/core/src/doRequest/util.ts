import { AsyncDataStatus } from './enums'
import { AsyncParticle, AsyncRequest, DoRequestOverride } from './models'

/**
 * Создать AsyncParticle с некоторыми данными по умолчанию.
 *
 * @param data Данные по умолчанию.
 */
export const getAsyncParticle = <DataType, ParamsType = unknown>(
  data: AsyncParticle<DataType, ParamsType>['data'] = null,
): AsyncParticle<DataType, ParamsType> => ({
  data,
  params: null,
  updatedAt: 0,
  error: null,
  status: AsyncDataStatus.IDLE,
})

/**
 * Утилита для работы с асинхронными запросами.
 *
 * @param particle Частица стейта.
 * @param request Функция, которая возвращает новые данные.
 * @param params Параметры, которые были отправлены в request.
 * @param override Переопределение логики before/success/failed кейсов.
 */
export const doRequest = async <Data, Params = unknown>(
  particle: AsyncParticle<Data, Params>,
  request: AsyncRequest<Data>,
  params: AsyncParticle<Data, Params>['params'],
  override: DoRequestOverride<Data, Params> = {},
): Promise<Data> => {
  const { before, success, failed } = override

  if (typeof before === 'function') {
    before({ particle, request, params })
  } else {
    if (particle.data === null) {
      particle.status = AsyncDataStatus.FETCHING
    } else {
      particle.status = AsyncDataStatus.UPDATING
    }

    if (!params) {
      particle.params = null
    } else {
      particle.params = {
        ...params,
      }
    }
  }

  try {
    const data = await request()

    if (typeof success === 'function') {
      success({ particle, request, params }, data)
    } else {
      particle.status = AsyncDataStatus.SUCCESS
      particle.data = data
      particle.updatedAt = Date.now()
      particle.error = null
    }

    return data
  } catch (error: unknown) {
    if (typeof failed === 'function') {
      failed({ particle, request, params }, error)
    } else {
      particle.status = AsyncDataStatus.FAILED
      particle.error = error as Error
    }

    throw error
  }
}

/**
 * Набор утилит для проверки статуса запроса.
 */
export const isIdle = (state: AsyncParticle<unknown>) => state.status === AsyncDataStatus.IDLE
export const isFetching = (state: AsyncParticle<unknown>) => state.status === AsyncDataStatus.FETCHING
export const isUpdating = (state: AsyncParticle<unknown>) => state.status === AsyncDataStatus.UPDATING
export const isLoading = (state: AsyncParticle<unknown>) => isFetching(state) || isUpdating(state)
export const isSuccess = (state: AsyncParticle<unknown>) => state.status === AsyncDataStatus.SUCCESS
export const isFailed = (state: AsyncParticle<unknown>) => state.status === AsyncDataStatus.FAILED
export const isSomethingFetching = (parts: Array<AsyncParticle<unknown>>) => parts.some(isFetching)
export const isSomethingLoading = (parts: Array<AsyncParticle<unknown>>) => parts.some(isLoading)
export const isSomethingFailed = (parts: Array<AsyncParticle<unknown>>) => parts.some(isFailed)
