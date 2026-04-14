import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import Elysia, { t } from "elysia";
import { childMatches } from "../../db/schemas";
import { create_modules_models } from "../../types";
import { select_found_children } from "../found_children";
import { select_missing_children } from "../missing_children";

export const select_child_matches = createSelectSchema(childMatches);
export const update_child_matches = createUpdateSchema(childMatches);

export const _update_child_match_status = t.Pick(update_child_matches, ["status"]);
export const select_child_matches_with_children = t.Object({
  ...select_child_matches.properties,
  found_child: select_found_children,
  missing_child: select_missing_children,
});
export const query_filter_child_matches = t.Optional(
  t.Object({
    found_child_id: t.Optional(t.String()),
    missing_child_id: t.Optional(t.String()),
    status: t.Optional(t.String()),
    min_score: t.Optional(t.Number()),
    page: t.Optional(t.String({ default: "1" })),
    limit: t.Optional(t.String({ default: "10" })),
  }),
);

const create_child_matches_model = create_modules_models("child_matches", select_child_matches_with_children);

export const child_matches_models = new Elysia().model({
  _update_child_match_status,
  query_filter_child_matches,
  run_matching_payload: t.Object({
    min_score: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
  }),
  ...create_child_matches_model,
});
