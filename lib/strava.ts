"use server";

import axios from "axios";
import { Configuration, ActivitiesApi, SummaryActivity } from "@/libs/strava_api_v3";

export interface StravaActivity {
  name: string;
  type: string;
  distance: number;
  average_speed: number;
  max_speed?: number;
  moving_time: number;
  total_elevation_gain?: number;
}

function checkEnvVars() {
  const required = ["STRAVA_CLIENT_ID", "STRAVA_CLIENT_SECRET", "STRAVA_REFRESH_TOKEN"];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
}

async function getAccessToken(): Promise<string> {
  checkEnvVars();

  const res = await axios.post("https://www.strava.com/oauth/token", {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const { access_token, refresh_token, expires_at } = res.data;

  // console.log("✅ Refreshed access token:", access_token);
  // Optionally persist new `refresh_token` and `expires_at` if needed

  return access_token;
}

export async function getWeeklyRuns(): Promise<StravaActivity[]> {
  try {
    const access_token = await getAccessToken();

    const afterTimestamp = Math.floor(new Date("2025-04-07").getTime() / 1000);

    const config = new Configuration({
      accessToken: access_token,
      basePath: "https://www.strava.com/api/v3",
    });

    const activitiesApi = new ActivitiesApi(config);

    const response = await activitiesApi.getLoggedInAthleteActivities(
      undefined, // before
      afterTimestamp, // after
      1, // page
      200 // perPage
    );

    return response.data
      .filter((activity: SummaryActivity) => activity.type === "Run")
      .map((activity) => ({
        name: activity.name!,
        type: activity.type!,
        distance: activity.distance!,
        average_speed: activity.average_speed!,
        max_speed: activity.max_speed!,
        moving_time: activity.moving_time!,
        total_elevation_gain: activity.total_elevation_gain!,
      }));
  } catch (err: unknown) {
    console.error("❌ Error fetching Strava activities:", err instanceof Error ? err.message : err);
    throw err;
  }
}
