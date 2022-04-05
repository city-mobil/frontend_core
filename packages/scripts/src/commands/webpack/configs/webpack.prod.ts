import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { WebpackPluginInstance } from 'webpack'
import { merge } from 'webpack-merge'

import { WebpackConfiguration } from '../types'
import { BUILD_ENVS } from './envs.js'
import commonConfig from './webpack.common.js'

const mode = 'production'

const { useImagesOptimizations } = BUILD_ENVS

const config: WebpackConfiguration = merge(commonConfig, {
  devtool: 'source-map',

  mode,

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
    }),
    useImagesOptimizations &&
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [['optipng', { optimizationLevel: 5 }]],
          },
        },
      }),
  ].filter(Boolean) as WebpackPluginInstance[],
})

export default config
