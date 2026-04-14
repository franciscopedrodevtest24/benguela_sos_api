import { matches_service } from "./matches.service";

let intervalRef: ReturnType<typeof setInterval> | null = null;

export const start_matches_cron = () => {
  const intervalMs = Number(Bun.env.MATCH_CRON_INTERVAL_MS || 300000);
  const minScore = Number(Bun.env.MATCH_MIN_SCORE || 55);

  if (intervalRef) return;

  intervalRef = setInterval(async () => {
    try {
      const result = await matches_service.runMatching(minScore);
      console.log("[matches-cron] run completed", result);
    } catch (error) {
      console.error("[matches-cron] run failed", error);
    }
  }, intervalMs);

  console.log(`[matches-cron] started every ${intervalMs}ms with minScore=${minScore}`);
};
