import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { foundChildren } from "../../db/schemas";
import {
  _create_found_children,
  _update_found_children,
  _update_status_found_children,
  query_filter_found_children,
} from "./found_children.models";

export class FoundChildrenRepository {
  async create(data: typeof _create_found_children.static) {
    const [children] = await db.insert(foundChildren).values(data).returning();

    return children;
  }

  async get_all_found_children(
    query: typeof query_filter_found_children.static,
  ) {
    const page_num = Number(query?.page || 1);
    const limit_num = Number(query.limit || 10);
    const offset = (page_num - 1) * limit_num;

    const query_builder = [];

    if (query.search) {
      query_builder.push(
        or(
          ilike(foundChildren.location_found, `%${query.search}%`),
          ilike(foundChildren.physical_description, `%${query.search}%`),
          ilike(foundChildren.additional_details, `%${query.search}%`),
          ilike(foundChildren.organization, `%${query.search}%`),
          ilike(foundChildren.estimated_age, `%${query.search}%`),
          ilike(foundChildren.current_status, `%${query.search}%`),
        ),
      );
    }
    if (query.status) {
      query_builder.push(eq(foundChildren.status, query.status as any));
    }

    const founds = await db
      .select()
      .from(foundChildren)
      .where(query_builder.length ? and(...query_builder) : undefined)
      .limit(limit_num)
      .offset(offset);

    const counts = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(foundChildren)
      .where(query_builder.length ? and(...query_builder) : undefined);

      const total = Number(counts[0]?.count ?? 0);
      const total_pages = Math.ceil(total / limit_num);

    return {
      items: founds,
      pagination: {
        page: page_num,
        limit: limit_num,
        total: total,
        totalPages: total_pages,
        hasNext: page_num < total_pages,
        hasPrev: page_num > 1,
      },
    };
  }
  async update_children(
    id: string,
    data: typeof _update_found_children.static,
  ) {
    const [children] = await db
      .update(foundChildren)
      .set(data)
      .where(eq(foundChildren.id, id))
      .returning();
    return children ?? null;
  }
  async update_status_children(
    id: string,
    data: typeof _update_status_found_children.static,
  ) {
    const [children] = await db
      .update(foundChildren)
      .set({
        status: data.status,
      })
      .where(eq(foundChildren.id, id))

      .returning();
    return children ?? null;
  }

  async get_by_id(id: string) {
    const [children] = await db
      .select()
      .from(foundChildren)
      .where(eq(foundChildren.id, id))
      .limit(1);
    return children ?? null;
  }

  async remove(id: string) {
    const [children] = await db
      .delete(foundChildren)
      .where(eq(foundChildren.id, id))
      .returning();
    return children ?? null;
  }
}

export const found_children_repository = new FoundChildrenRepository();
