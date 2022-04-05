import { WebpackDevServerConfiguration } from '../types'

const devServerDefaultConfig: WebpackDevServerConfiguration = {
  historyApiFallback: true,
  host: 'localhost',
  hot: true,
  open: true,
  port: 3000,
  allowedHosts: 'all',
  client: {
    overlay: { errors: true, warnings: false },
  },
}

export default devServerDefaultConfig
