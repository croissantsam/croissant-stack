import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { RouterClient } from '@orpc/server'
import { router } from '@workspace/orpc/router'

export const link = new RPCLink({
  url: `http://localhost:3000/api/rpc`,
  async fetch(request, init) {
    const { fetch } = await import('expo/fetch')
    
    const resp = await fetch(request.url, {
      body: await request.blob(),
      headers: request.headers,
      method: request.method,
      signal: request.signal,
      ...init,
    })

    return resp
  },
})

export const orpc: RouterClient<typeof router> = createORPCClient(link)
