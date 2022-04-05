import { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

declare type WebpackConfiguration = Configuration

declare type WebpackDevServerConfiguration = WebpackDevServer.Configuration

declare type UserWebpackConfig = {
  webpack?: (config: WebpackConfiguration, options: { dev: boolean }) => WebpackConfiguration
  devServer?: (config: WebpackDevServerConfiguration) => WebpackDevServerConfiguration
}
