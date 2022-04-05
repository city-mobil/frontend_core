import { PNG_EXT } from './png.js'
import { SVG_EXT } from './svg.js'

export interface OptimizeFunctionResult {
  data: string | Buffer
  path: string
}
export type OptimizeFunction = (path: string) => Promise<OptimizeFunctionResult>
export type OptimizeExt = typeof SVG_EXT | typeof PNG_EXT
export interface HandleFileResult {
  oldPath: string
  newPath: string
  oldSize: number
  newSize: number
}

/**
 * Мок возвращаемого типа execa, тк в оригинале слишком широкий тип
 */
export type ExecaStdout = { stdout: string }
