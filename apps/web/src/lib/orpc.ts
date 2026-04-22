import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { createRouterClient } from '@orpc/server'
import { router } from '@workspace/orpc/router'
import { auth } from '@workspace/auth/lib/auth'
import type { RouterClient } from '@orpc/server'

const getORPCClient = createIsomorphicFn()
  .server(() => 
    createRouterClient(router, {
      context: async () => {
        const headers = getRequestHeaders()
        const session = await auth.api.getSession({
          headers,
        })
        return {
          session,
        }
      },
    })
  )
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    })

    return createORPCClient(link)
  })

export const orpc = getORPCClient()
