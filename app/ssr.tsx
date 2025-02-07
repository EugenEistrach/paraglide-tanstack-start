/// <reference types="vinxi/types/server" />
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/start/server'
import { getRouterManifest } from '@tanstack/start/router-manifest'

import { createRouter } from './router'
import { applyLanguageOnServer } from './utils/i18n'
export default createStartHandler({
  createRouter,
  getRouterManifest,
})((ctx) => {
  const lang = applyLanguageOnServer(ctx.request)

  // we apply the set cookie here so on initial page load its set for the client
  const responseHeaders = new Headers(ctx.responseHeaders)
  responseHeaders.append('Set-Cookie', `language=${lang}; Path=/;`)

  return defaultStreamHandler({
    ...ctx,
    responseHeaders,
  })
})
