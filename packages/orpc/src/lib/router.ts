import { ORPCError, os } from '@orpc/server'
import { db, schema } from '@workspace/db'
import { eq } from 'drizzle-orm'
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

  createPlanet: o
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        distanceFromSun: z.number(),
        diameter: z.number(),
        hasRings: z.boolean().default(false),
        atmosphere: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const [newPlanet] = await db.insert(planets).values(input).returning()
      return newPlanet
    }),

  updatePlanet: o
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        distanceFromSun: z.number(),
        diameter: z.number(),
        hasRings: z.boolean(),
        atmosphere: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const { id, ...data } = input
      const results = await db
        .update(planets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(planets.id, id))
        .returning()
      
      const updatedPlanet = results[0]
      
      if (!updatedPlanet) {
        throw new ORPCError('NOT_FOUND')
      }
      
      return updatedPlanet
    }),

  deletePlanet: o
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .handler(async ({ input }) => {
      const results = await db
        .delete(planets)
        .where(eq(planets.id, input.id))
        .returning()
      
      const deletedPlanet = results[0]
      
      if (!deletedPlanet) {
        throw new ORPCError('NOT_FOUND')
      }
      
      return deletedPlanet
    }),
})

export type AppRouter = typeof router
