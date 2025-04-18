"use server";
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
  if (!process.env.STRAVA_ACCESS_TOKEN) {
    throw new Error("Missing STRAVA_ACCESS_TOKEN in environment variables");
  }
}

export async function getWeeklyRuns(): Promise<StravaActivity[]> {
  try {
    checkEnvVars();
    const access_token = process.env.STRAVA_ACCESS_TOKEN!;
    const aprilFirst2025 = Math.floor(new Date("2025-04-07").getTime() / 1000);

    const config = new Configuration({
      accessToken: access_token,
      basePath: "https://www.strava.com/api/v3",
    });
    const activitiesApi = new ActivitiesApi(config);

    const response = await activitiesApi.getLoggedInAthleteActivities(
      undefined, // before
      aprilFirst2025, // after
      1, // page
      200 // perPage - increased to get more activities
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
    console.error("Error fetching Strava activities:", err instanceof Error ? err.message : "Unknown error");
    throw err;
  }
}
