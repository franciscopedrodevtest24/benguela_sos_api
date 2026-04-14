import { and, Column, eq, getTableColumns, gte, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { childMatches, foundChildren, missingChildren } from "../../db/schemas";
import { _update_child_match_status, query_filter_child_matches } from "./matches.models";

export class MatchesRepository {
  async upsert_match(data: typeof childMatches.$inferInsert) {
    const [saved] = await db
      .insert(childMatches)
      .values(data)
      .onConflictDoUpdate({
        target: [childMatches.found_child_id, childMatches.missing_child_id],
        set: {
          score: data.score,
          confidence_label: data.confidence_label,
          match_reason: data.match_reason,
          updated_at: new Date(),
        },
      })
      .returning();

    return saved;
  }

  async list(query: typeof query_filter_child_matches.static) {
    const page_num = Number(query?.page || 1);
    const limit_num = Number(query?.limit || 10);
    const offset = (page_num - 1) * limit_num;

    const query_builder = [];

    if (query?.found_child_id) {
      query_builder.push(eq(childMatches.found_child_id, query.found_child_id));
    }
    if (query?.missing_child_id) {
      query_builder.push(eq(childMatches.missing_child_id, query.missing_child_id));
    }
    if (query?.status) {
      query_builder.push(eq(childMatches.status, query.status as any));
    }
    if (query?.min_score !== undefined) {
      query_builder.push(gte(childMatches.score, Number(query.min_score)));
    }

    const items = await db
      .select({
        ...getTableColumns(childMatches),
        found_child: {
          ...getTableColumns(foundChildren),
        },
        missing_child: {
          ...getTableColumns(missingChildren),
        },
      })
      .from(childMatches)
      .innerJoin(foundChildren, eq(childMatches.found_child_id, foundChildren.id))
.innerJoin(missingChildren, eq(childMatches.missing_child_id, missingChildren.id))
      .where(query_builder.length ? and(...query_builder) : undefined)
      .limit(limit_num)
      .offset(offset);

    const counts = await db
      .select({ count: sql<number>`count(*)` })
      .from(childMatches)
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

  async update_status(id: string, data: typeof _update_child_match_status.static) {
    const [updated] = await db
      .update(childMatches)
      .set({ status: data.status })
      .where(eq(childMatches.id, id))
      .returning({ id: childMatches.id });
  
    if (!updated) return null;
  
    const [item] = await db
      .select({
        ...getTableColumns(childMatches),
        found_child: {
          ...getTableColumns(foundChildren),
        },
        missing_child: {
          ...getTableColumns(missingChildren),
        },
      })
      .from(childMatches)
      .innerJoin(foundChildren, eq(childMatches.found_child_id, foundChildren.id))
      .innerJoin(missingChildren, eq(childMatches.missing_child_id, missingChildren.id))
      .where(eq(childMatches.id, id))
      .limit(1);
  
    return item ?? null;
  }
}

export const matches_repository = new MatchesRepository();
