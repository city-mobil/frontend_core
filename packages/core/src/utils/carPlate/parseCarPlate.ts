import { CarPlate, CarPlateDetailed } from './types'

const plateRegexp = /(\D+)(\d{3})(\D*)(\d+)/

/**
 * Функция разделяющая строку с российским номером автомобиля на основную часть и регион.
 * В основной части серия и регистрационный номер разделены и представлены массивом строк
 * Например 'с065мк999' разделится на:
 * ['с', '065', 'мк'] – серия и регистрационный номер
 * '999' – номер региона
 *
 * @param plate строка с номером автомобиля. Серия, регистрационный номер и код
 *  региона не разделены пробелом.
 */
export const parseCarPlateDetailed = (plate: string): CarPlateDetailed | undefined => {
  const data = plateRegexp.exec(plate)

  if (!data || data.length < 4) {
    return undefined
  }

  const clearedData = data
    .splice(1) // Убираем исходную строку
    .filter(Boolean) // Убираем пустые строки
  const plateRegion = clearedData.pop() || ''

  return {
    plateBase: clearedData,
    plateRegion,
  }
}

/**
 * Функция разделяющая строку с российским номером автомобиля на основную часть и регион.
 * Например 'с065мк999' разделится на:
 * 'с065мк' – серия и регистрационный номер
 * '999' – номер региона
 *
 * @param plate строка с номером автомобиля. Серия, регистрационный номер и код
 *  региона не разделены пробелом.
 */
export const parseCarPlate = (plate: string): CarPlate | undefined => {
  const parsed = parseCarPlateDetailed(plate)

  if (!parsed) return undefined

  return {
    plateBase: parsed.plateBase.join(''),
    plateRegion: parsed.plateRegion,
  }
}
