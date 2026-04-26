import { ORPCError, os } from '@orpc/server'
import { z } from 'zod'
import { planetRouter } from './planets'
import type { Session } from '@workspace/auth/lib/auth'

export type RPCContext = {
  session: Session | null
}

const o = os.$context<RPCContext>()

export const router = o.router({
  planets: planetRouter,

  hello: o
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .handler(({ input }) => {
      return {
        message: `Hello, ${input.name ?? 'world'}!`,
      }
    }),

  getSecretData: o
    .use(async ({ context, next }) => {
      if (!context.session) {
        throw new ORPCError('UNAUTHORIZED')
      }
      return next({
        context: {
          session: context.session,
        },
      })
    })
    .handler(({ context }) => {
      return {
        secret: `This is secret data for ${context.session.user.name}`,
        email: context.session.user.email,
      }
    }),
})

export type AppRouter = typeof router
