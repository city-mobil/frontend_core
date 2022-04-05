import { CommandModule } from 'yargs'
import fs from 'fs'
import path from 'path'
import { commandExecutionPath, distPath, filesToCopy, pkgName, pkgPath } from '../helpers'

interface Options {
  forConfig?: boolean
}

const configEntryPoint = 'index.js'

export const postBuild: CommandModule<undefined, Options> = {
  command: 'postBuild',
  describe: 'Copy files to dist dir / prepare package.json',
  builder: {
    forConfig: {
      type: 'boolean',
      default: false,
      description: 'Do same thing, but for config package :)',
    },
  },
  handler: (options) => {
    const { forConfig } = options
    filesToCopy.forEach((file) => {
      const filePath = path.join(commandExecutionPath, file)
      const fileDistPath = path.join(distPath, file)
      fs.copyFileSync(filePath, fileDistPath)
    })

    const pkgRaw = fs.readFileSync(pkgPath, { encoding: 'utf-8' })
    const pkg = JSON.parse(pkgRaw) as Record<string, unknown>

    if (forConfig) {
      const filePath = path.join(commandExecutionPath, configEntryPoint)
      const fileDistPath = path.join(distPath, configEntryPoint)
      fs.copyFileSync(filePath, fileDistPath)
    } else {
      if (!pkg.bin) {
        pkg.main = 'index.js'
        pkg.module = 'index.js'
        pkg.types = 'index.d.ts'
      }
    }

    const pkgDistPath = path.join(distPath, pkgName)
    fs.writeFileSync(pkgDistPath, JSON.stringify(pkg, null, 2))
  },
}
