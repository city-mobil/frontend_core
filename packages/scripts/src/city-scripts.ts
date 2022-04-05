#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { resourceLint, webpack } from './commands/index.js'

const args = hideBin(process.argv)

void yargs(args)
  .command(resourceLint)
  .command(webpack)
  .strict()
  .demandCommand(1, 'You need at least one command before moving on')
  .alias({ h: 'help' })
  .help()
  .parse()
