#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { postBuild, preBuild } from './commands'

const args = hideBin(process.argv)

void yargs(args)
  .command(preBuild)
  .command(postBuild)
  .strict()
  .demandCommand(1, 'You need at least one command before moving on')
  .alias({ h: 'help' })
  .help()
  .parse()
