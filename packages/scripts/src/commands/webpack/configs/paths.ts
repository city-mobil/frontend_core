import fs from 'fs'
import path from 'path'
import getPublicUrlOrPath from 'react-dev-utils/getPublicUrlOrPath.js'

const appDir = process.cwd()

const permittedExtensions = ['json', 'js']

const resolveFilePath = (filename: string) => path.resolve(appDir, filename)

// для файлов, у которых могут быть несколько расширений
const applyExtensionResolver = (filename: string, defaultExtension: string) => {
  const extension = permittedExtensions.find((ext) => fs.existsSync(resolveFilePath(`${filename}.${ext}`)))

  if (extension) {
    return `${filename}.${extension}`
  }

  return `${filename}.${defaultExtension}`
}

const getPublicPath = (isDev: boolean) => {
  const appPackageJson = JSON.parse(fs.readFileSync(resolveFilePath('package.json')) as unknown as string) as Record<
    string,
    any
  >
  const homepage = appPackageJson.homepage as string | undefined

  return getPublicUrlOrPath(isDev, homepage, process.env.PUBLIC_URL)
}

const getPaths = (isDev: boolean) => {
  return {
    appDir,
    webpackConfig: resolveFilePath('webpack-config.js'),
    eslintConfig: resolveFilePath(applyExtensionResolver('.eslintrc', 'json')),
    stylelintConfig: resolveFilePath(applyExtensionResolver('.stylelintrc', 'json')),
    tsConfig: resolveFilePath(applyExtensionResolver('tsconfig', 'json')),
    dotenv: resolveFilePath('.env'),
    publicPath: getPublicPath(isDev),
  }
}

export default getPaths
