import { db } from "../../db/client";
import { foundChildren, missingChildren } from "../../db/schemas";
import { _update_child_match_status, query_filter_child_matches } from "./matches.models";
import { MatchesRepository, matches_repository } from "./matches.repository";

type MatchResult = {
  found_child_id: string;
  missing_child_id: string;
  score: number;
  confidence_label: "low" | "medium" | "high";
  match_reason: string;
};

const normalizeText = (input: string | null | undefined): string =>
  (input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTokenSet = (value: string | null | undefined): Set<string> => {
  const text = normalizeText(value);
  if (!text) return new Set();
  return new Set(text.split(" ").filter((token) => token.length > 2));
};

const jaccard = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

const parseDateSafe = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const daysDiff = (a: Date, b: Date): number => {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

const extractFirstNumber = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
};

const estimateAgeFromDate = (birthDate: string | null | undefined): number | null => {
  const parsed = parseDateSafe(birthDate);
  if (!parsed) return null;
  const now = new Date();
  const age = now.getFullYear() - parsed.getFullYear();
  return age >= 0 ? age : null;
};

const labelFromScore = (score: number): "low" | "medium" | "high" => {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
};

export class MatchesService {
  constructor(private repository: MatchesRepository) {
    this.repository = repository;
  }

  private scorePair(found: typeof foundChildren.$inferSelect, missing: typeof missingChildren.$inferSelect) {
    let score = 0;
    const reasons: string[] = [];

    if (found.gender && missing.gender && found.gender === missing.gender) {
      score += 15;
      reasons.push("gênero compatível");
    }

    const descSim = jaccard(
      toTokenSet(found.physical_description),
      toTokenSet(missing.physical_description),
    );
    if (descSim > 0) {
      const points = Math.round(descSim * 35);
      score += points;
      reasons.push(`descrição física semelhante (${Math.round(descSim * 100)}%)`);
    }

    const locationSim = jaccard(
      toTokenSet(found.location_found),
      toTokenSet(missing.last_seen_location),
    );
    if (locationSim > 0) {
      const points = Math.round(locationSim * 25);
      score += points;
      reasons.push(`localização semelhante (${Math.round(locationSim * 100)}%)`);
    }

    const foundDate = parseDateSafe(found.date_found);
    const missingDate = parseDateSafe(missing.last_seen_date);
    if (foundDate && missingDate) {
      const diff = daysDiff(foundDate, missingDate);
      if (diff <= 3) {
        score += 15;
        reasons.push("datas próximas (até 3 dias)");
      } else if (diff <= 10) {
        score += 8;
        reasons.push("datas relativamente próximas (até 10 dias)");
      }
    }

    const estimatedAge = extractFirstNumber(found.estimated_age);
    const missingAge = estimateAgeFromDate(missing.date_of_birth);
    if (estimatedAge !== null && missingAge !== null) {
      const diff = Math.abs(estimatedAge - missingAge);
      if (diff <= 1) {
        score += 10;
        reasons.push("idade compatível (diferença <= 1)");
      } else if (diff <= 3) {
        score += 5;
        reasons.push("idade próxima (diferença <= 3)");
      }
    }

    return {
      score: Math.min(score, 100),
      reasons,
    };
  }

  async runMatching(minScore = 55) {
    const founds = await db.select().from(foundChildren);
    const missings = await db.select().from(missingChildren);

    const results: MatchResult[] = [];

    for (const found of founds) {
      for (const missing of missings) {
        const { score, reasons } = this.scorePair(found, missing);
        if (score < minScore) continue;

        const match: MatchResult = {
          found_child_id: found.id,
          missing_child_id: missing.id,
          score,
          confidence_label: labelFromScore(score),
          match_reason: reasons.join(", "),
        };
        results.push(match);
      }
    }

    for (const result of results) {
      await this.repository.upsert_match({
        ...result,
        status: "potential",
      });
    }

    return {
      scannedFoundChildren: founds.length,
      scannedMissingChildren: missings.length,
      createdOrUpdatedMatches: results.length,
      minScore,
    };
  }

  async list(query: typeof query_filter_child_matches.static) {
    return await this.repository.list(query);
  }

  async update_status(id: string, data: typeof _update_child_match_status.static) {
    return await this.repository.update_status(id, data);
  }
}

export const matches_service = new MatchesService(matches_repository);
