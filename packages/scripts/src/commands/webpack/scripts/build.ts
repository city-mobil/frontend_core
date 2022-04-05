#!/usr/bin/env node

'use strict'

import fs from 'fs'
import webpack from 'webpack'

import getPaths from '../configs/paths.js'
import defaultProdWebpackConfig from '../configs/webpack.prod.js'
import { UserWebpackConfig } from '../types'

const paths = getPaths(false)

void (async () => {
  let webpackConfig = defaultProdWebpackConfig

  const userWebpackConfig =
    fs.existsSync(paths.webpackConfig) && ((await import(paths.webpackConfig)) as UserWebpackConfig)

  if (userWebpackConfig && typeof userWebpackConfig.webpack === 'function') {
    webpackConfig = userWebpackConfig.webpack(defaultProdWebpackConfig, { dev: false })
  }

  const compiler = webpack(webpackConfig)

  console.log('Production build started\n')

  compiler.run((err, stats) => {
    if (err) {
      console.log(err)

      return
    }

    if (stats) {
      const s = stats.toJson()

      if (s?.warnings?.length) {
        s.warnings.forEach((warning) => console.log(warning))
      }

      if (s?.errors?.length) {
        s.errors.forEach((error) => console.log(error))

        return
      }

      console.log(stats.toString())
    }

    compiler.close(() => {
      if (err) {
        console.log(err)
      }
    })
  })
})()
