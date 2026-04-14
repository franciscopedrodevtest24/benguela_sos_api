import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import Elysia, { t } from "elysia";
import { missingChildren } from "../../db/schemas";
import { create_modules_models } from "../../types";

export const create_missing_children = createInsertSchema(missingChildren);
export const select_missing_children = createSelectSchema(missingChildren);
export const update_missing_children = createUpdateSchema(missingChildren);

export const _create_missing_children = t.Omit(create_missing_children, [
  "id",
  "created_at",
  "updated_at",
]);
export const _update_missing_children = update_missing_children;
export const _update_status_missing_children = t.Pick(update_missing_children, ["status"]);

export const query_filter_missing_children = t.Optional(
  t.Object({
    search: t.Optional(t.String()),
    status: t.Optional(t.String()),
    page: t.Optional(t.String({ default: "1" })),
    limit: t.Optional(t.String({ default: "10" })),
  }),
);

const create_missing_children_model = create_modules_models(
  "missing_children",
  select_missing_children,
);

export const missing_children_models = new Elysia().model({
  create_missing_children: _create_missing_children,
  update_missing_children: _update_missing_children,
  _update_status_missing_children,
  query_filter_missing_children,
  ...create_missing_children_model,
});
