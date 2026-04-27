import { ORPCError, os } from "@orpc/server";
import { db, schema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { RPCContext } from "./router";

const { planets } = schema;

const o = os.$context<RPCContext>();

export const planetRouter = o.router({
  getPlanets: o.handler(async () => {
    const allPlanets = await db.select().from(planets);
    return allPlanets;
  }),

  createPlanet: o
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        distanceFromSun: z.number(),
        diameter: z.number(),
        hasRings: z.boolean().optional(),
        atmosphere: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const [newPlanet] = await db.insert(planets).values(input).returning();
      return newPlanet;
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
      const { id, ...data } = input;
      const results = await db
        .update(planets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(planets.id, id))
        .returning();

      if (results.length === 0) {
        throw new ORPCError("NOT_FOUND");
      }

      return results[0];
    }),

  deletePlanet: o
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .handler(async ({ input }) => {
      const results = await db.delete(planets).where(eq(planets.id, input.id)).returning();

      if (results.length === 0) {
        throw new ORPCError("NOT_FOUND");
      }

      return results[0];
    }),
});
