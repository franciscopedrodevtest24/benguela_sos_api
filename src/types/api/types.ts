import { t, TSchema } from "elysia";

export const pagination_meta_schema=t.Object({
    page:t.Number(),
    limit:t.Number(),
    total:t.Number(),
    totalPages:t.Number(),
    hasNext:t.Boolean(),
    hasPrev:t.Boolean()
})
export const api_success_schema=<T extends TSchema >(data_schema:T)=>t.Object({
    success:t.Literal(true),
    message:t.Optional(t.String()),
    data:data_schema,
    timestamp:t.String({format:"date-time"})
})

export const api_error_schema=t.Object({
    success:t.Literal(false),
    error:t.Optional(t.Record(t.String(),t.Unknown())),
    timestamp:t.String({format:"date-time"})
})

export const api_response_schema=<T extends  TSchema>(data_schema:T)=>t.Union([
    api_success_schema(data_schema),
    api_error_schema
])

export const paginated_data_schema=< T extends TSchema>(items_schema:T)=>t.Object({
    items:t.Array(items_schema),
    pagination:pagination_meta_schema
})

export const paginated_response_schema=< T extends TSchema>(items_schema:T)=>
    api_success_schema(paginated_data_schema(items_schema))


export const create_api_models=< T extends TSchema>(schema:T)=>{
    return {
        response:api_response_schema(schema),
        success:api_success_schema(schema),
        paginated:paginated_response_schema(schema),
        error:api_error_schema
    }
}


export const create_modules_models=<const TName extends string,
TSchemaType extends TSchema
>(name:TName,schema:TSchemaType)=>{
    const models=create_api_models(schema)

    return {
        [name]:schema,
        [`${name}_success`]:models.success,
        [`${name}_response`]:models.response,
        [`${name}_paginated`]:models.paginated,
        [`${name}_error_api`]:models.error,
    } as {
        [K in TName]:TSchemaType
    }&{
        [K in `${TName}_success`]: typeof models.success
    }&{
        [K in `${TName}_response`]: typeof models.response
    }&{
        [K in `${TName}_paginated`]: typeof models.paginated
    }
    &{
        [K in `${TName}_error_api`]: typeof models.error
    }
}