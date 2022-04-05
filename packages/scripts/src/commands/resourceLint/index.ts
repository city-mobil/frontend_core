import ora from 'ora'
import path from 'path'
import { CommandModule } from 'yargs'

import { asyncFind, noop } from '../../helpers/index.js'
import { OPTIMIZED_PATTERN } from './constants.js'
import { handleFile } from './helpers.js'

const commandExecutionPath = process.cwd()

export interface Options {
  folder: string
  fix?: boolean
  extensions?: string[]
}

export const resourceLint: CommandModule<Record<string, never>, Options> = {
  command: 'resourceLint <folder>',
  describe: 'Lint and optimize files',
  builder: {
    folder: { type: 'string', description: 'Target directory for resourceLint' },
    fix: {
      type: 'boolean',
      default: false,
      description: 'Create optimized file -> change links from old path to new -> remove old file',
    },
    extensions: {
      type: 'array',
      alias: '-e',
      default: ['svg', 'png'],
      description: 'File extensions for optimize. Pattern - ext',
    },
  },
  handler: (argv) => {
    const run = async () => {
      try {
        const { folder = '', fix, extensions = [] } = argv
        const folderPath = path.join(commandExecutionPath, folder)
        const extensionsPattern = extensions.join('|')
        const findPaths = path.join(folderPath, `**/*.+(${extensionsPattern})`)

        const unoptimizedPaths = await asyncFind(findPaths, { ignore: [OPTIMIZED_PATTERN] })

        if (unoptimizedPaths.length === 0) {
          process.exit(0)
        }

        if (fix) {
          const start = Date.now()
          let optimizedSize = 0
          console.log('Start optimize files...')

          for (const unoptimizedPath of unoptimizedPaths) {
            const oldPath = unoptimizedPath.replace(commandExecutionPath, '')
            const spinner = ora(oldPath).start()

            const result = await handleFile(folderPath, unoptimizedPath)

            if (!result) {
              spinner.stop()
              continue
            }

            const { oldSize, newSize } = result
            const diffSize = oldSize - newSize

            if (diffSize < 0) {
              spinner.fail(`${oldPath} bad optimization, new size (${newSize}) > old size (${oldSize})`)
              process.exit(1)
            } else {
              optimizedSize += diffSize
              spinner.succeed(`${oldPath} optimized`)
            }
          }

          console.log(
            `Total fix time: ${Date.now() - start}ms. Fixed files count ${
              unoptimizedPaths.length
            }. Optimized size: ${optimizedSize}kb`,
          )
          process.exit(0)
        }

        console.log('Files need to be optimized:')

        for (const unoptimizedPath of unoptimizedPaths) {
          console.log(unoptimizedPath.replace(commandExecutionPath, ''))
        }

        console.log(`Unoptimized files count: ${unoptimizedPaths.length}`)

        process.exit(1)
      } catch (e) {
        console.error(e)
        process.exit(1)
      }
    }

    run().catch(noop)
  },
}
