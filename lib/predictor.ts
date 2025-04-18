import OpenAI from "openai";
import { StravaActivity } from "./strava";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePrediction(runs: StravaActivity[]) {
  const prompt = `
Based on the following training data, predict marathon finish time:
${runs
  .map((run) => `Distance: ${run.distance / 1000}km, Pace: ${run.average_speed}, HR: ${run.average_heartrate}`)
  .join("\n")}
- Consider consistency, longest run, and pace.
Return a single predicted time (HH:MM) and confidence (1-100).
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message?.content;
}
