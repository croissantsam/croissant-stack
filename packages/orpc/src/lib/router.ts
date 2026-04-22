import { ORPCError, os } from '@orpc/server'
import { db, schema } from '@workspace/db'
import { z } from 'zod'
import type { Session } from '@workspace/auth/lib/auth'

export type RPCContext = {
  session: Session | null
}

const { planets } = schema

const o = os.$context<RPCContext>()

export const router = o.router({
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

  getPlanets: o
    .handler(async () => {
      const allPlanets = await db.select().from(planets)
      return allPlanets
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
