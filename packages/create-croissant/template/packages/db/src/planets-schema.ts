import { boolean, pgTable, real, serial, text, timestamp } from "drizzle-orm/pg-core";

export const planets = pgTable("planets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  distanceFromSun: real("distance_from_sun").notNull(), // In millions of kilometers
  diameter: real("diameter").notNull(), // In kilometers
  hasRings: boolean("has_rings").notNull().default(false),
  atmosphere: text("atmosphere"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
