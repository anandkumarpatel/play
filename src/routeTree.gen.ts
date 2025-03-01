/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as WinIndexImport } from './routes/win/index'
import { Route as SolitaireIndexImport } from './routes/solitaire/index'
import { Route as NumberIndexImport } from './routes/number/index'
import { Route as MathIndexImport } from './routes/math/index'
import { Route as EmojiIndexImport } from './routes/emoji/index'
import { Route as ColorIndexImport } from './routes/color/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const WinIndexRoute = WinIndexImport.update({
  id: '/win/',
  path: '/win/',
  getParentRoute: () => rootRoute,
} as any)

const SolitaireIndexRoute = SolitaireIndexImport.update({
  id: '/solitaire/',
  path: '/solitaire/',
  getParentRoute: () => rootRoute,
} as any)

const NumberIndexRoute = NumberIndexImport.update({
  id: '/number/',
  path: '/number/',
  getParentRoute: () => rootRoute,
} as any)

const MathIndexRoute = MathIndexImport.update({
  id: '/math/',
  path: '/math/',
  getParentRoute: () => rootRoute,
} as any)

const EmojiIndexRoute = EmojiIndexImport.update({
  id: '/emoji/',
  path: '/emoji/',
  getParentRoute: () => rootRoute,
} as any)

const ColorIndexRoute = ColorIndexImport.update({
  id: '/color/',
  path: '/color/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/color/': {
      id: '/color/'
      path: '/color'
      fullPath: '/color'
      preLoaderRoute: typeof ColorIndexImport
      parentRoute: typeof rootRoute
    }
    '/emoji/': {
      id: '/emoji/'
      path: '/emoji'
      fullPath: '/emoji'
      preLoaderRoute: typeof EmojiIndexImport
      parentRoute: typeof rootRoute
    }
    '/math/': {
      id: '/math/'
      path: '/math'
      fullPath: '/math'
      preLoaderRoute: typeof MathIndexImport
      parentRoute: typeof rootRoute
    }
    '/number/': {
      id: '/number/'
      path: '/number'
      fullPath: '/number'
      preLoaderRoute: typeof NumberIndexImport
      parentRoute: typeof rootRoute
    }
    '/solitaire/': {
      id: '/solitaire/'
      path: '/solitaire'
      fullPath: '/solitaire'
      preLoaderRoute: typeof SolitaireIndexImport
      parentRoute: typeof rootRoute
    }
    '/win/': {
      id: '/win/'
      path: '/win'
      fullPath: '/win'
      preLoaderRoute: typeof WinIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/color': typeof ColorIndexRoute
  '/emoji': typeof EmojiIndexRoute
  '/math': typeof MathIndexRoute
  '/number': typeof NumberIndexRoute
  '/solitaire': typeof SolitaireIndexRoute
  '/win': typeof WinIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/color': typeof ColorIndexRoute
  '/emoji': typeof EmojiIndexRoute
  '/math': typeof MathIndexRoute
  '/number': typeof NumberIndexRoute
  '/solitaire': typeof SolitaireIndexRoute
  '/win': typeof WinIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/color/': typeof ColorIndexRoute
  '/emoji/': typeof EmojiIndexRoute
  '/math/': typeof MathIndexRoute
  '/number/': typeof NumberIndexRoute
  '/solitaire/': typeof SolitaireIndexRoute
  '/win/': typeof WinIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/color'
    | '/emoji'
    | '/math'
    | '/number'
    | '/solitaire'
    | '/win'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/color' | '/emoji' | '/math' | '/number' | '/solitaire' | '/win'
  id:
    | '__root__'
    | '/'
    | '/color/'
    | '/emoji/'
    | '/math/'
    | '/number/'
    | '/solitaire/'
    | '/win/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ColorIndexRoute: typeof ColorIndexRoute
  EmojiIndexRoute: typeof EmojiIndexRoute
  MathIndexRoute: typeof MathIndexRoute
  NumberIndexRoute: typeof NumberIndexRoute
  SolitaireIndexRoute: typeof SolitaireIndexRoute
  WinIndexRoute: typeof WinIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ColorIndexRoute: ColorIndexRoute,
  EmojiIndexRoute: EmojiIndexRoute,
  MathIndexRoute: MathIndexRoute,
  NumberIndexRoute: NumberIndexRoute,
  SolitaireIndexRoute: SolitaireIndexRoute,
  WinIndexRoute: WinIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/color/",
        "/emoji/",
        "/math/",
        "/number/",
        "/solitaire/",
        "/win/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/color/": {
      "filePath": "color/index.tsx"
    },
    "/emoji/": {
      "filePath": "emoji/index.tsx"
    },
    "/math/": {
      "filePath": "math/index.tsx"
    },
    "/number/": {
      "filePath": "number/index.tsx"
    },
    "/solitaire/": {
      "filePath": "solitaire/index.tsx"
    },
    "/win/": {
      "filePath": "win/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
