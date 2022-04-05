import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import webpack, { WebpackPluginInstance } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import { WebpackConfiguration } from '../types'
import { BUILD_ENVS, FRONT_ENVS } from './envs.js'
import getPaths from './paths.js'
import { defaultImagesRules, defaultScriptRules, defaultStyleRules } from './webpack.rules.js'

const { isDev, isAnalyze, useEsbuild, useImagesOptimizations } = BUILD_ENVS

const paths = getPaths(isDev)

const { appDir, publicPath } = paths

const scriptsRules = useEsbuild ? defaultScriptRules.esbuild(isDev) : defaultScriptRules.babel(isDev)

const config: WebpackConfiguration = {
  target: 'web',

  entry: path.resolve(appDir, 'src', 'index'),

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '...'],
    plugins: [new TsconfigPathsPlugin()],
  },

  module: {
    rules: [...defaultStyleRules(isDev), ...defaultImagesRules(useImagesOptimizations), ...scriptsRules],
  },

  optimization: {
    splitChunks: { chunks: 'all' },
    minimizer: [`...`, new CssMinimizerPlugin()],
    usedExports: true,
  },

  output: {
    filename: 'static/js/[name].[contenthash:8].js',
    path: path.resolve(appDir, 'build'),
    publicPath,
    assetModuleFilename: 'static/media/[name].[hash][ext]',
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.resolve(appDir, 'public'), globOptions: { ignore: ['**/index.html'] } }],
    }),

    new webpack.DefinePlugin({
      'process.env': JSON.stringify(FRONT_ENVS),
    }),

    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(appDir, 'public', 'index.html'),
    }),

    isAnalyze && new BundleAnalyzerPlugin(),
  ].filter(Boolean) as WebpackPluginInstance[],
}

export default config
