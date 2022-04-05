import fs from 'fs'

/**
 * Возвращает размер файла в килобайтах
 * @param filePath {string}
 */
export const getFileSize = (filePath: string): number => {
  const { size } = fs.statSync(filePath)
  const sizeNumber = Number(size)

  return Number((sizeNumber / 1024).toFixed(1))
}
