import { CommandModule } from 'yargs'
import fs from 'fs'
import { distPath } from '../helpers'

export const preBuild: CommandModule<Record<string, never>, undefined> = {
  command: 'preBuild',
  describe: 'Clean prev dist dir / create dist dir',
  handler: () => {
    fs.rmSync(distPath, { recursive: true, force: true })
    fs.mkdirSync(distPath)
  },
}
