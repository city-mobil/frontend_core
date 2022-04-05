import { execa } from 'execa'
import path from 'path'

import { getFileSize, removeFile, writeFile } from '../../helpers/index.js'
import { OPTIMIZED_KEY } from './constants.js'
import { optimizePng, PNG_EXT } from './png.js'
import { optimizeSvg, SVG_EXT } from './svg.js'
import { ExecaStdout, HandleFileResult, OptimizeExt, OptimizeFunction } from './types'

export const getOptimizedPath = (filePath: string, fileExt: string) =>
  `${filePath.substring(0, filePath.length - fileExt.length)}.${OPTIMIZED_KEY}${fileExt}`

const handlers: Record<OptimizeExt, OptimizeFunction> = {
  [SVG_EXT]: optimizeSvg,
  [PNG_EXT]: optimizePng,
}

export const handleFile = async (folderPath: string, filePath: string): Promise<HandleFileResult | undefined> => {
  const fileExt = path.extname(filePath) as OptimizeExt
  const handler = handlers[fileExt]

  if (!handler) return

  const { data, path: newPath } = await handler(filePath)
  const oldFileName = filePath.split('/').pop() || ''
  const newFileName = newPath.split('/').pop() || ''
  const oldSize = getFileSize(filePath)

  writeFile(newPath, data)

  const newSize = getFileSize(newPath)

  let pathsString = ''

  try {
    const { stdout } = (await execa('grep', ['-R', '-l', oldFileName, folderPath])) as ExecaStdout

    pathsString = stdout
  } catch (e) {
    /**
     * grep exit code = 1 => не нашли вхождение по строке
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (e.exitCode !== 1) return
  }

  if (pathsString.length === 0) return

  const paths = pathsString.split('\n')

  for (const filePath of paths) {
    if (filePath.length === 0) continue

    await execa('sed', ['-i', '', `s/${oldFileName}/${newFileName}/g`, filePath])
  }

  removeFile(filePath)

  return {
    oldPath: filePath,
    newPath: newPath,
    oldSize,
    newSize,
  }
}
