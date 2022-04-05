import {
  AsyncDataStatus,
  AsyncParticle,
  AsyncRequest,
  doRequest,
  DoRequestOverride,
  DoRequestOverrideData,
} from '@city/core'
import { runInAction } from 'mobx'

const defaultBefore: DoRequestOverride<unknown, unknown>['before'] = <Data, Params>(
  part: DoRequestOverrideData<Data, Params>,
) => {
  runInAction(() => {
    const { particle, params } = part

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
  })
}

const defaultSuccess: DoRequestOverride<unknown, unknown>['success'] = <Data, Params>(
  data: DoRequestOverrideData<Data, Params>,
  response: Data,
) => {
  runInAction(() => {
    const { particle } = data

    particle.status = AsyncDataStatus.SUCCESS
    particle.data = response
    particle.updatedAt = Date.now()
    particle.error = null
  })
}

const defaultFailed: DoRequestOverride<unknown, unknown>['failed'] = <Data, Params>(
  data: DoRequestOverrideData<Data, Params>,
  error: unknown,
) => {
  runInAction(() => {
    const { particle } = data

    particle.status = AsyncDataStatus.FAILED
    particle.error = error as Error
  })
}

/**
 * Асинхронный запрос для MobX стора.
 *
 * @param {AsyncParticle} particle Частица стора.
 * @param {AsyncRequest>} request Запрос.
 * @param {AsyncParticle["params"]} params Параметры для запроса.
 * @param {DoRequestOverride} override Переопределение хендлеров.
 * @returns {Promise}
 */
export const mobxRequest = async <Data, Params = unknown>(
  particle: AsyncParticle<Data, Params>,
  request: AsyncRequest<Data>,
  params: AsyncParticle<Data, Params>['params'],
  override: DoRequestOverride<Data, Params> = {},
): Promise<Data> => {
  const customOverride = {
    before: defaultBefore,
    success: defaultSuccess,
    failed: defaultFailed,
    ...override,
  }

  return doRequest(particle, request, params, customOverride)
}
