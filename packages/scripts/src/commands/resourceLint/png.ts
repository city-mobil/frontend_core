import { execa } from 'execa'
import fs from 'fs'
import pngquant from 'pngquant-bin'

import { getOptimizedPath } from './helpers.js'
import { OptimizeFunction } from './types'

export const PNG_EXT = '.png'

export const optimizePng: OptimizeFunction = async (path) => {
  const optimizedPath = getOptimizedPath(path, PNG_EXT)
  const file = fs.readFileSync(path)

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { stdout } = await execa(pngquant, ['-', '--quality=65-80'], {
      encoding: null,
      maxBuffer: Infinity,
      input: file,
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { data: stdout, path: optimizedPath }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (e.exitCode === 99) {
      return { data: file, path: optimizedPath }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    e.message = e.stderr || e.message
    throw e
  }
}
