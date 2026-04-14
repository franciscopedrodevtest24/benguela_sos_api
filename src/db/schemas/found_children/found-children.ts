import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { foundStatusEnum, genderEnum } from "../enums";

export const foundChildren = pgTable("found_children", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),

  // Informações da criança
  estimated_age: varchar("estimated_age", { length: 50 }).notNull(),
  gender: genderEnum("gender"),
  physical_description: text("physical_description").notNull(),
  special_characteristics: text("special_characteristics"),

  // Informações do local e data
  location_found: text("location_found").notNull(),
  date_found: varchar("date_found", { length: 20 }).notNull(),
  time_found: varchar("time_found", { length: 10 }),

  // Status e detalhes adicionais
  current_status: varchar("current_status", { length: 100 }).notNull(),
  additional_details: text("additional_details"),

  // Informações do denunciante
  reporter_name: varchar("reporter_name", { length: 255 }).notNull(),
  reporter_email: varchar("reporter_email", { length: 255 }).notNull(),
  reporter_phone: varchar("reporter_phone", { length: 50 }).notNull(),
  organization: varchar("organization", { length: 255 }),

  // Metadados
  status: foundStatusEnum("status").default("pending_verification").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type FoundChild = typeof foundChildren.$inferSelect;
export type NewFoundChild = typeof foundChildren.$inferInsert;
