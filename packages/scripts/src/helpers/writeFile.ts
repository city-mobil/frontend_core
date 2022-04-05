import fs from 'fs'

export const writeFile = (path: string, data: string | Buffer): void => {
  fs.writeFileSync(path, data)
}
