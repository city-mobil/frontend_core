import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: false,
  },
  plugins: [resolve(), commonjs(), typescript()],
  external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)],
}
