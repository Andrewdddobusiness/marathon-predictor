"use server";

import { getWeeklyRuns } from "@/lib/strava";
import { generatePrediction } from "@/lib/predictor";

export async function predictMarathonTime() {
  const runs = await getWeeklyRuns();

  const prediction = await generatePrediction(runs);
  return prediction;
}
