import glob from 'glob'

export interface AsyncFindOptions {
  ignore?: ReadonlyArray<string>
}

export const asyncFind = (path: string, options?: AsyncFindOptions): Promise<string[]> => {
  const { ignore = [] } = options || {}

  return new Promise((resolve, reject) => {
    glob(path, { ignore }, (err, files) => {
      if (err) {
        reject(err)
      }

      resolve(files)
    })
  })
}
