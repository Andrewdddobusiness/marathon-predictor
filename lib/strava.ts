import axios from "axios";

export interface StravaActivity {
  type: string;
  distance: number;
  average_speed: number;
  average_heartrate?: number;
}

const STRAVA_BASE = "https://www.strava.com/api/v3";

async function getAccessToken() {
  const res = await axios.post("https://www.strava.com/oauth/token", {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  return res.data.access_token;
}

export async function getWeeklyRuns() {
  const access_token = await getAccessToken();
  const weekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;

  const res = await axios.get(`${STRAVA_BASE}/athlete/activities`, {
    headers: { Authorization: `Bearer ${access_token}` },
    params: { after: weekAgo, per_page: 100 },
  });

  return res.data.filter((activity: StravaActivity) => activity.type === "Run");
}
