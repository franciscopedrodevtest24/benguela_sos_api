import { createInsertSchema ,createSelectSchema,createUpdateSchema} from "drizzle-typebox";
import { foundChildren } from "../../db/schemas";
import Elysia, { t } from "elysia";
import { create_modules_models } from "../../types";


export const create_found_children=createInsertSchema(foundChildren)
export const select_found_children=createSelectSchema(foundChildren)
export const update_found_children=createUpdateSchema(foundChildren)
export const _select_found_children=createSelectSchema(foundChildren)
export const _create_found_children=t.Omit(create_found_children,["id","created_at","updated_at"])
export const _update_found_children=createUpdateSchema(foundChildren)
export const _update_status_found_children=t.Pick(update_found_children,["status"])

export const query_filter_found_children=t.Optional(
    t.Object({
        search:t.Optional(t.String()),
        status:t.Optional(t.String()),
        page:t.Optional(t.String({default:"1"})),
        limit:t.Optional(t.String({default:"10"})),
    })
)


const create_found_children_model=create_modules_models("found_children",_select_found_children)
export const found_children_models=new Elysia()
.model({
    "create_found_children":_create_found_children,
    "update_found_children":_update_found_children,
    "_update_status_found_children":_update_status_found_children,
    "query_filter_found_children":query_filter_found_children,
    ...create_found_children_model
})