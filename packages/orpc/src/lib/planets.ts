import { ORPCError, os } from "@orpc/server";
import { db, schema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { type } from "arktype";
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
      type({
        name: "string>0",
        "description?": "string",
        distanceFromSun: "number",
        diameter: "number",
        "hasRings?": "boolean",
        "atmosphere?": "string",
      }),
    )
    .handler(async ({ input }) => {
      const [newPlanet] = await db.insert(planets).values(input).returning();
      return newPlanet;
    }),

  updatePlanet: o
    .input(
      type({
        id: "number",
        name: "string>0",
        "description?": "string",
        distanceFromSun: "number",
        diameter: "number",
        hasRings: "boolean",
        "atmosphere?": "string",
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
      type({
        id: "number",
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
