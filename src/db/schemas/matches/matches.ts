import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { matchStatusEnum } from "../enums";
import { foundChildren } from "../found_children";
import { missingChildren } from "../missing_children";

export const childMatches = pgTable(
  "child_matches",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    found_child_id: text("found_child_id")
      .references(() => foundChildren.id, { onDelete: "cascade" })
      .notNull(),
    missing_child_id: text("missing_child_id")
      .references(() => missingChildren.id, { onDelete: "cascade" })
      .notNull(),
    score: integer("score").notNull(),
    confidence_label: varchar("confidence_label", { length: 20 }).notNull(),
    match_reason: text("match_reason").notNull(),
    status: matchStatusEnum("status").default("potential").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ([
   { uniqMatchPair: uniqueIndex("uniq_match_pair").on(
      table.found_child_id,
      table.missing_child_id,
    ),
    foundIdx: index("child_matches_found_idx").on(table.found_child_id),
    missingIdx: index("child_matches_missing_idx").on(table.missing_child_id),
    scoreIdx: index("child_matches_score_idx").on(table.score),}
  ]),
);

export type ChildMatch = typeof childMatches.$inferSelect;
export type NewChildMatch = typeof childMatches.$inferInsert;
