import dotEnv from 'dotenv'
import { expand as dotEnvExpand } from 'dotenv-expand'
import fs from 'fs'

import getPaths from './paths.js'

const { ANALYZE, USE_ESBUILD, NODE_ENV, USE_IMG_OPT, USE_LINTERS } = process.env

const isDev = NODE_ENV === 'development'
const isAnalyze = ANALYZE === 'true'
const noCompilerSelected = USE_ESBUILD === undefined
const useEsbuild = USE_ESBUILD === 'true' || (noCompilerSelected && isDev)
const useImagesOptimizations = USE_IMG_OPT === 'true'
const useLinters = USE_LINTERS === 'true'

export const BUILD_ENVS = {
  isDev,
  isAnalyze,
  noCompilerSelected,
  useEsbuild,
  useImagesOptimizations,
  useLinters,
}

const paths = getPaths(isDev)

const { dotenv } = paths

const REACT_APP = /^REACT_APP_/i

// возможные названия файлов с переменными окружения
const dotenvFiles = [`${dotenv}.local`, dotenv]

// здесь мы просто расширяем наши переменные окружения ('dotenv-expand')
// и устанавливаем их в process.env ('dotenv')
dotenvFiles.forEach((dotenvFile) => {
  if (dotenvFile && fs.existsSync(dotenvFile)) {
    dotEnvExpand(
      dotEnv.config({
        path: dotenvFile,
      }),
    )
  }
})

export const FRONT_ENVS = Object.keys(process.env)
  .filter((key) => REACT_APP.test(key))
  .reduce(
    (acc, env) => {
      acc[env] = String(process.env[env])

      return acc
    },
    {
      NODE_ENV,
    } as Record<string, string>,
  )
