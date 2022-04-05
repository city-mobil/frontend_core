#!/usr/bin/env node

'use strict'

import fs from 'fs'
import openBrowser from 'react-dev-utils/openBrowser.js'
import { choosePort, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils.js'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import defaultDevServerConfig from '../configs/dev-server.js'
import getPaths from '../configs/paths.js'
import defaultDevWebpackConfig from '../configs/webpack.dev.js'
import { UserWebpackConfig } from '../types'

const paths = getPaths(true)

const runServer = async () => {
  let webpackConfig = defaultDevWebpackConfig
  let devServerConfig = defaultDevServerConfig
  let protocol = 'http'

  const userWebpackConfig =
    fs.existsSync(paths.webpackConfig) && ((await import(paths.webpackConfig)) as UserWebpackConfig)

  if (userWebpackConfig && typeof userWebpackConfig.webpack === 'function') {
    webpackConfig = userWebpackConfig.webpack(defaultDevWebpackConfig, { dev: true })
  }

  if (userWebpackConfig && typeof userWebpackConfig.devServer === 'function') {
    devServerConfig = userWebpackConfig.devServer(defaultDevServerConfig)
  }

  const compiler = webpack(webpackConfig)

  if (devServerConfig.server) {
    if (typeof devServerConfig.server === 'object' && devServerConfig.server.type) {
      protocol = devServerConfig.server.type
    } else if (typeof devServerConfig.server === 'string') {
      protocol = devServerConfig.server
    }
  }

  const PORT = Number(devServerConfig.port) || 3000
  const HOST = String(devServerConfig.host) || 'localhost'
  const startPage = paths.publicPath

  // choosePort предлагает выбрать другой порт, если дефолтный занят
  const port = await choosePort(HOST, PORT)

  if (!port) {
    return
  }

  const urls = prepareUrls(protocol, HOST, port)

  const server = new WebpackDevServer({ ...devServerConfig, port, host: HOST, open: false }, compiler)

  server.startCallback(() => {
    // prepareUrls возвращает адрес заканчивающийся на '/'
    const root = urls.localUrlForBrowser.slice(0, -1)
    const startUrl = root + startPage

    console.log(`Starting development server on ${startUrl}`)

    openBrowser(startUrl)
  })
  ;['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      console.log('Stopping server...')
      void server.stop().then(() => {
        process.exit()
      })
    })
  })
}

void runServer()
