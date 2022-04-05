/**
 * Статус для асинхронных данных.
 *
 * IDLE - Ожидание. Данные не были загружены.
 * FETCHING - Загрузка. Данные загружаются.
 * UPDATING - Обновление уже загруженных данных, возможно лоадер не нужен.
 * SUCCESS - Успех. Данные были успешно загружены.
 * FAILED - Ошибка. Произошла ошибка во время загрузки данных.
 */
export enum AsyncDataStatus {
  IDLE = 'IDLE',
  FETCHING = 'FETCHING',
  UPDATING = 'UPDATING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
