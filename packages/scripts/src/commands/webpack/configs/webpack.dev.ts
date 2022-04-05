import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import fs from 'fs'
import StylelintPlugin from 'stylelint-webpack-plugin'
import { WebpackPluginInstance } from 'webpack'
import { merge } from 'webpack-merge'

import { WebpackConfiguration } from '../types'
import { BUILD_ENVS } from './envs.js'
import getPaths from './paths.js'
import commonConfig from './webpack.common.js'

const { useLinters, isDev } = BUILD_ENVS

const paths = getPaths(isDev)

const { eslintConfig, stylelintConfig, tsConfig } = paths

const enableEslint = useLinters && fs.existsSync(eslintConfig)
const enableStyleLint = useLinters && fs.existsSync(stylelintConfig)
const enableTSConfig = fs.existsSync(tsConfig)

const mode = 'development'

const config: WebpackConfiguration = merge(commonConfig, {
  devtool: 'eval-cheap-source-map',

  mode,

  plugins: [
    new ReactRefreshWebpackPlugin(),

    new CaseSensitivePathsPlugin(),

    enableEslint && new ESLintPlugin({ cache: true, extensions: ['js', 'ts', 'tsx', 'jsx'], failOnError: true }),

    enableStyleLint &&
      new StylelintPlugin({
        cache: true,
        extensions: ['ts', 'tsx', 'js', 'jsx', 'css', 'scss', 'sass'],
        failOnError: true,
      }),

    enableTSConfig && new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean) as WebpackPluginInstance[],
})

export default config
