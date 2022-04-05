import fs from 'fs'
import { optimize, OptimizedSvg, OptimizeOptions } from 'svgo'

import { getOptimizedPath } from './helpers.js'
import { OptimizeFunction } from './types'

export const SVG_EXT = '.svg'
const minifyOptions: OptimizeOptions = {
  plugins: [
    {
      active: true,
      name: 'cleanupAttrs',
    },
    {
      active: true,
      name: 'removeDoctype',
    },
    {
      active: true,
      name: 'removeXMLProcInst',
    },
    {
      active: true,
      name: 'removeComments',
    },
    {
      active: true,
      name: 'removeMetadata',
    },
    {
      active: true,
      name: 'removeTitle',
    },
    {
      active: true,
      name: 'removeDesc',
    },
    {
      active: true,
      name: 'removeUselessDefs',
    },
    {
      active: true,
      name: 'removeEditorsNSData',
    },
    {
      active: true,
      name: 'removeEmptyAttrs',
    },
    {
      active: true,
      name: 'removeHiddenElems',
    },
    {
      active: true,
      name: 'removeEmptyText',
    },
    {
      active: true,
      name: 'removeEmptyContainers',
    },
    {
      active: false,
      name: 'removeViewBox',
    },
    {
      active: true,
      name: 'cleanupEnableBackground',
    },
    {
      active: true,
      name: 'convertStyleToAttrs',
    },
    {
      active: true,
      name: 'convertColors',
    },
    {
      active: true,
      name: 'convertPathData',
    },
    {
      active: true,
      name: 'convertTransform',
    },
    {
      active: true,
      name: 'removeUnknownsAndDefaults',
    },
    {
      active: true,
      name: 'removeNonInheritableGroupAttrs',
    },
    {
      active: true,
      name: 'removeUselessStrokeAndFill',
    },
    {
      active: true,
      name: 'removeUnusedNS',
    },
    {
      active: true,
      name: 'cleanupIDs',
    },
    {
      active: true,
      name: 'cleanupNumericValues',
    },
    {
      active: true,
      name: 'moveElemsAttrsToGroup',
    },
    {
      active: true,
      name: 'moveGroupAttrsToElems',
    },
    {
      active: true,
      name: 'collapseGroups',
    },
    {
      active: false,
      name: 'removeRasterImages',
    },
    {
      active: true,
      name: 'mergePaths',
    },
    {
      active: true,
      name: 'convertShapeToPath',
    },
    {
      active: true,
      name: 'sortAttrs',
    },
    {
      active: false,
      name: 'removeDimensions',
    },
    {
      active: true,
      name: 'prefixIds',
    },
  ],
}

export const optimizeSvg: OptimizeFunction = (path) => {
  return Promise.resolve().then(() => {
    const file = fs.readFileSync(path, 'utf-8')
    const optimizedFile = optimize(file, minifyOptions) as OptimizedSvg
    const optimizedPath = getOptimizedPath(path, SVG_EXT)

    return { data: optimizedFile.data, path: optimizedPath }
  })
}
