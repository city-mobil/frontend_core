import path from 'path'

export const commandExecutionPath = process.cwd()
export const distPath = path.join(commandExecutionPath, 'dist')
export const pkgName = 'package.json'
export const pkgPath = path.join(commandExecutionPath, pkgName)
export const filesToCopy = ['LICENSE', 'README.md']
