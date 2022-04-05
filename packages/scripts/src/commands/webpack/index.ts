import childProcess from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { CommandModule } from 'yargs'

export interface WebpackOptions {
  arg: 'start' | 'build'
}

export const webpack: CommandModule<unknown, WebpackOptions> = {
  command: 'webpack <arg>',
  builder: {
    arg: {
      type: 'string',
    },
  },
  handler: (argv: WebpackOptions) => {
    const { arg } = argv
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    let script

    if (arg === 'start') {
      process.env.BABEL_ENV = 'development'
      process.env.NODE_ENV = 'development'

      script = './scripts/start'
    } else if (arg === 'build') {
      process.env.BABEL_ENV = 'production'
      process.env.NODE_ENV = 'production'

      script = './scripts/build'
    } else {
      process.exit(1)
    }

    const filePath = path.resolve(__dirname, script)

    const result = childProcess.spawnSync('node', [filePath], { stdio: 'inherit' })

    if (result.signal) {
      process.exit(1)
    }

    const status = typeof result.status === 'number' ? result.status : undefined
    process.exit(status)
  },
}
