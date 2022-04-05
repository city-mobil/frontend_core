import fs from 'fs'

export const removeFile = (path: string): void => {
  fs.unlinkSync(path)
}
