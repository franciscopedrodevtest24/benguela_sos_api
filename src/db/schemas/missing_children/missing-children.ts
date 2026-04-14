// schema/missing-children.ts
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { genderEnum, missingStatusEnum } from "../enums";

export const missingChildren = pgTable("missing_children", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),

  // Informações da criança
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  date_of_birth: varchar("date_of_birth", { length: 20 }).notNull(),
  gender: genderEnum("gender"),
  physical_description: text("physical_description").notNull(),

  // Informações do desaparecimento
  last_seen_location: text("last_seen_location").notNull(),
  last_seen_date: varchar("last_seen_date", { length: 20 }).notNull(),
  last_seen_time: varchar("last_seen_time", { length: 10 }),
  circumstances: text("circumstances"),

  // Informações do denunciante
  reporter_name: varchar("reporter_name", { length: 255 }).notNull(),
  reporter_email: varchar("reporter_email", { length: 255 }).notNull(),
  reporter_phone: varchar("reporter_phone", { length: 50 }).notNull(),
  relationship: varchar("relationship", { length: 100 }).notNull(),

  // Metadados
  status: missingStatusEnum("status").default("active").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Types inferidos automaticamente
export type MissingChild = typeof missingChildren.$inferSelect;
export type NewMissingChild = typeof missingChildren.$inferInsert;
