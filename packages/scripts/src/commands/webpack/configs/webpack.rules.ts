import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { createRequire } from 'module'
import path from 'path'
import { RuleSetRule, RuleSetUseItem } from 'webpack'

import getPaths from './paths.js'

const require = createRequire(import.meta.url)

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

export const defaultStyleRules = (isDev: boolean): RuleSetRule[] => {
  const getCommonStyleLoaders = (cssOptions: { [index: string]: any }): RuleSetUseItem[] => {
    const postCssLoader: RuleSetUseItem = {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [
            [
              require.resolve('autoprefixer'),
              {
                flexbox: 'no-2009',
              },
            ],
          ],
        },
      },
    }

    const cssLoader: RuleSetUseItem = {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    }

    const { publicPath } = getPaths(isDev)

    const styleLoader: RuleSetUseItem = isDev
      ? require.resolve('style-loader')
      : {
          loader: MiniCssExtractPlugin.loader,
          options: publicPath.startsWith('.') ? { publicPath: '../../' } : {},
        }

    const loaders = [styleLoader, cssLoader, postCssLoader]

    return loaders
  }

  return [
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      use: getCommonStyleLoaders({}),
    },
    {
      test: cssModuleRegex,
      use: getCommonStyleLoaders({
        modules: {
          localIdentName: '[local]-[hash]',
        },
      }),
    },
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: [
        ...getCommonStyleLoaders({}),
        require.resolve('resolve-url-loader'),
        {
          loader: require.resolve('sass-loader'),
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: sassModuleRegex,
      use: [
        ...getCommonStyleLoaders({
          modules: {
            localIdentName: '[local]-[hash]',
          },
        }),
        require.resolve('resolve-url-loader'),
        {
          loader: require.resolve('sass-loader'),
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ]
}

export const defaultImagesRules = (useOptimizations: boolean): RuleSetRule[] => {
  return [
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 4096,
        outputPath: 'static/media',
      },
      issuer: {
        and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
      },
    },
    {
      test: /\.svg$/i,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
          options: {
            svgoConfig: {
              plugins: [
                {
                  cleanupIDs: false,
                  removeViewBox: false,
                },
              ],
            },
            svgo: useOptimizations,
          },
        },
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: 4096,
            outputPath: 'static/media',
          },
        },
      ],
      issuer: {
        and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
      },
    },
  ]
}

export const defaultScriptRules = {
  esbuild: (isDev: boolean): RuleSetRule[] => [
    {
      test: /\.tsx?$/i,
      exclude: /node_modules/,
      include: path.resolve(getPaths(isDev).appDir, 'src'),
      use: [
        {
          loader: require.resolve('esbuild-loader'),
          options: {
            loader: 'tsx',
            target: 'es2015',
          },
        },
      ],
    },
    {
      test: /\.jsx?$/i,
      exclude: /node_modules/,
      include: path.resolve(getPaths(isDev).appDir, 'src'),
      use: [
        {
          loader: require.resolve('esbuild-loader'),
          options: {
            loader: 'jsx',
            target: 'es2015',
          },
        },
      ],
    },
  ],
  babel: (isDev: boolean): RuleSetRule[] => [
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: path.resolve(getPaths(isDev).appDir, 'src'),
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          [
            require.resolve('babel-preset-react-app'),
            {
              runtime: 'classic',
            },
          ],
        ],
        plugins: isDev ? [require.resolve('react-refresh/babel')] : [],
        cacheDirectory: true,
        cacheCompression: false,
        compact: !isDev,
      },
    },
  ],
}
