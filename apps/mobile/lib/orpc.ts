import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { RouterClient } from '@orpc/server'
import { router } from '@workspace/orpc/router'
import { authClient } from './auth-client'

export const link = new RPCLink({
  url: `https://platform.localhost/api/rpc`,
  async fetch(request, init) {
    const { fetch } = await import('expo/fetch')
    const headers = new Map<string, string>(); 
    const cookies = authClient.getCookie(); 
        if (cookies) { 
          headers.set("Cookie", cookies); 
        } 
    
    const resp = await fetch(request.url, {
      body: await request.blob(),
      headers: Object.fromEntries(headers),
      method: request.method,
      signal: request.signal,
      ...init,
    })

    return resp
  },
})

export const orpc: RouterClient<typeof router> = createORPCClient(link)
