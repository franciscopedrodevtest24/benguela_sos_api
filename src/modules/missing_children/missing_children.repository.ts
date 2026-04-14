import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { missingChildren } from "../../db/schemas";
import {
  _create_missing_children,
  _update_missing_children,
  _update_status_missing_children,
  query_filter_missing_children,
} from "./missing_children.models";

export class MissingChildrenRepository {
  async create(data: typeof _create_missing_children.static) {
    const [children] = await db.insert(missingChildren).values(data).returning();
    return children;
  }

  async get_all_missing_children(query: typeof query_filter_missing_children.static) {
    const page_num = Number(query?.page || 1);
    const limit_num = Number(query?.limit || 10);
    const offset = (page_num - 1) * limit_num;

    const query_builder = [];

    if (query?.search) {
      query_builder.push(
        or(
          ilike(missingChildren.first_name, `%${query.search}%`),
          ilike(missingChildren.last_name, `%${query.search}%`),
          ilike(missingChildren.last_seen_location, `%${query.search}%`),
          ilike(missingChildren.physical_description, `%${query.search}%`),
        ),
      );
    }

    if (query?.status) {
      query_builder.push(eq(missingChildren.status, query.status as any));
    }

    const items = await db
      .select()
      .from(missingChildren)
      .where(query_builder.length ? and(...query_builder) : undefined)
      .limit(limit_num)
      .offset(offset);

    const counts = await db
      .select({ count: sql<number>`count(*)` })
      .from(missingChildren)
      .where(query_builder.length ? and(...query_builder) : undefined);

    const total = Number(counts[0]?.count || 0);
    const total_pages = Math.ceil(total / limit_num);

    return {
      items,
      pagination: {
        page: page_num,
        limit: limit_num,
        total,
        totalPages: total_pages,
        hasNext: page_num < total_pages,
        hasPrev: page_num > 1,
      },
    };
  }

  async get_by_id(id: string) {
    const [children] = await db
      .select()
      .from(missingChildren)
      .where(eq(missingChildren.id, id))
      .limit(1);
    return children ?? null;
  }

  async update_children(id: string, data: typeof _update_missing_children.static) {
    const [children] = await db
      .update(missingChildren)
      .set(data)
      .where(eq(missingChildren.id, id))
      .returning();
    return children ?? null;
  }

  async update_status_children(
    id: string,
    data: typeof _update_status_missing_children.static,
  ) {
    const [children] = await db
      .update(missingChildren)
      .set({ status: data.status })
      .where(eq(missingChildren.id, id))
      .returning();
    return children ?? null;
  }

  async remove(id: string) {
    const [children] = await db
      .delete(missingChildren)
      .where(eq(missingChildren.id, id))
      .returning();
    return children ?? null;
  }
}

export const missing_children_repository = new MissingChildrenRepository();
