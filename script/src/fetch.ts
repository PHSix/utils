import type { RequestInfo, RequestInit } from 'node-fetch'
import nodeFetch from 'node-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'
import env from './env'

interface FetchInit extends RequestInit {
  proxy?: string
}

/**
 * wrap node-fetch, with a proxy option or auto detect env variable `https_proxy`, `HTTPS_PROXY`, `http_proxy` and `HTTP_PROXY`
 */
export function fetch(url: URL | RequestInfo, init?: FetchInit) {
  init = init ?? {}
  if (!init.agent) {
    // auto proxy
    const requestUrl = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url
    if (!init.proxy) {
      const proxy = requestUrl.startsWith('https') ? env.https_proxy : env.http_proxy
      if (proxy) {
        init.agent = new HttpsProxyAgent(proxy)
      }
    } else {
      init.agent = new HttpsProxyAgent(init.proxy)
    }
  }

  return nodeFetch(url, init)
}
