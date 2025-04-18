import OpenAI from "openai";
import { StravaActivity } from "./strava";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface PredictionResult {
  predictedTime: string; // HH:MM format
  confidence: number; // 1-100
  confidenceLevel: "low" | "medium" | "high";
  daysUntilRace: number;
  trainingVolume: number;
  averagePace: string;
  longestRun: number;
}

export async function generatePrediction(runs: StravaActivity[]): Promise<PredictionResult> {
  const totalDistance = runs.reduce((sum, run) => sum + (run.distance || 0), 0);
  const averagePace = runs.reduce((sum, run) => sum + (run.average_speed || 0), 0) / runs.length;
  const longestRun = Math.max(...runs.map((run) => run.distance || 0));

  const prompt = `
You are a marathon finish time predictor.

You will receive recent run training data and return ONLY a JSON object with the following format — NO commentary, NO explanations, and NO markdown — just raw JSON.

Format:
{
  "predictedTime": "HH:MM",
  "confidence": number between 1-100,
  "confidenceLevel": "low" | "medium" | "high",
  "daysUntilRace": number,
  "trainingVolume": number (in km),
  "averagePace": "MM:SS/km",
  "longestRun": number (in km)
}

Training runs:
${runs.map((run) => `Distance: ${(run.distance || 0) / 1000}km, Pace: ${run.average_speed || 0}m/s`).join("\n")}

Total volume: ${(totalDistance / 1000).toFixed(2)}km
Average pace: ${averagePace.toFixed(2)}m/s
Longest run: ${(longestRun / 1000).toFixed(2)}km

Respond ONLY with a JSON object matching the above format. DO NOT include any commentary or explanation.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-1106-preview", // or "gpt-4-turbo"
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  // Safe to use .function_call or .message.content depending on SDK version
  try {
    const parsed: PredictionResult = JSON.parse(completion.choices[0].message?.content || "{}");
    return parsed;
  } catch (error) {
    console.error("Failed to parse GPT response:", error);
    return {
      predictedTime: "00:00",
      confidence: 0,
      confidenceLevel: "low",
      daysUntilRace: 0,
      trainingVolume: 0,
      averagePace: "00:00",
      longestRun: 0,
    };
  }
}
