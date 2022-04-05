/**
 * Простое ожидание через промис.
 * await wait(1000); // Подождать секунду.
 *
 * @param ms Кол-во миллисекунд, через которое промис зарезолвится.
 */
export const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Выполнить асинхронный запрос, повторяя его, если произошла ошибка.
 *
 * @param request Запрос.
 * @param attempts Максимальное кол-во попыток (по умолчанию 1).
 * @param delay Задержка между попытками в миллисекундах (по умолчанию 1 000).
 */
export const withAttempts = async <T>(request: () => Promise<T>, attempts = 1, delay = 1000): Promise<T> => {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await request()
    } catch (e) {
      if (i === attempts) {
        throw e
      }

      if (delay) {
        await wait(delay)
      }
    }
  }

  throw new Error('[withAttempts] Max request exceeded')
}

/**
 * Выполнить асинхронный запрос, оборвав его, если он не зарезолвился за указанное время.
 *
 * @param request Запрос.
 * @param timeout Максимальное время выполнения в миллисекундах (по умолчанию 30 000).
 */
export const withTimeout = async <T>(request: () => Promise<T>, timeout = 30000): Promise<T> => {
  const timeoutErrorRequest = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('[withTimeout] Request timed out')), timeout)
  })

  const result = await Promise.race([request(), timeoutErrorRequest])

  // В промисе-таймауте нет resolve-варианта,
  // поэтому ТС справедливо считает его Promise<unknown>
  // Но в этом кейсе resolve-вариант никогда
  // не случится, поэтому приводим руками к
  // типу резолва первого промиса.
  return result as Promise<T>
}

/**
 * Выполнять запрос до тех пор, пока не будет успешный результат или истечет время.
 *
 * @param request Запрос.
 * @param timeout Максимальное время в миллисекундах (по умолчанию 30 000).
 * @param delay Задержка между повторными попытками в миллисекундах (по умолчанию 1 000).
 */
export const untilTimeout = async <T>(request: () => Promise<T>, timeout = 30000, delay = 1000): Promise<T> => {
  const attempts = delay ? Math.ceil(timeout / delay) : 99999 // Достаточно большое кол-во попыток, если мы делаем их без задержки.

  const requestWithAttempts = () => withAttempts(request, attempts, delay)

  return withTimeout(requestWithAttempts, timeout)
}

/**
 * Выполнить асинхронный запрос с минимальным временем запроса.
 * Под капотом Promise.allSettled - желательно юзать полифилл https://www.npmjs.com/package/promise.allsettled
 *
 * @param request Запрос.
 * @param minDuration Минимальное время выполнения в миллисекундах (по умолчанию 300).
 */
export const withMinDuration = async <T>(request: () => Promise<T>, minDuration = 300): Promise<T> => {
  const [result] = await Promise.allSettled([request(), wait(minDuration)])

  if (result.status !== 'fulfilled') {
    throw result.reason
  }

  return result.value
}

/**
 * Выполнить асинхронный запрос с автоматическими ретраями при падении.
 * Под капотом Promise.allSettled - желательно юзать полифилл https://www.npmjs.com/package/promise.allsettled
 *
 * Интервал между ретраями растёт экспоненциально: 100мс, 200мс... до maxDelay мс.
 *
 * @param request Запрос.
 * @param maxDelay Максимальное время ретрев в миллисекундах (по умолчанию 30 000).
 */
export const withAutoRetries = async <T>(request: () => Promise<T>, maxDelay = 30000): Promise<T> => {
  let delay = 50

  while (delay < maxDelay) {
    delay = delay * 2

    try {
      return await withMinDuration<T>(request, delay)
    } catch (error: unknown) {
      if (delay >= maxDelay) {
        throw error
      }
    }
  }

  // Не должно вызываться, просто чтобы тайпскрипт не ругался.
  throw new Error('[withAutoRetries] Request timed out')
}
