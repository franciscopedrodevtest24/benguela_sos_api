import { pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "unknown"]);
export const foundStatusEnum = pgEnum("found_status", [
  "pending_verification",
  "verified",
  "resolved",
  "archived",
]);

export const missingStatusEnum = pgEnum("missing_status", [
  "active",
  "found",
  "closed",
  "archived",
]);

export const matchStatusEnum = pgEnum("match_status", [
  "potential",
  "reviewed",
  "confirmed",
  "rejected",
]);