"use client";

import { StravaActivity } from "@/lib/strava";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface RunnerStats {
  speed: number; // Based on best pace
  endurance: number; // Based on longest run
  stamina: number; // Based on weekly volume
  recovery: number; // Based on frequency of runs
  strength: number; // Based on elevation gain
  technique: number; // Based on pace consistency
}

interface RunnerStatsProps {
  className?: string;
  activities?: StravaActivity[];
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  value?: number;
  payload?: {
    subject: string;
    A: number;
  };
  index?: number;
}

export function calculateStats(activities: StravaActivity[] = []): {
  speed: number;
  endurance: number;
  stamina: number;
  recovery: number;
  strength: number;
  technique: number;
} {
  if (!activities.length) {
    return {
      speed: 30,
      endurance: 30,
      stamina: 30,
      recovery: 30,
      strength: 30,
      technique: 30,
    };
  }

  // Calculate best pace (m/s to min/km)
  const bestPace = Math.min(...activities.map((a) => 1000 / a.average_speed / 60));
  // Normalize pace to 0-100 scale (assuming 3:00/km is 100 and 8:00/km is 0)
  const speedScore = Math.min(100, Math.max(0, ((8 - bestPace) / (8 - 3)) * 100));

  // Calculate longest run in km
  const longestRun = Math.max(...activities.map((a) => a.distance)) / 1000;
  // Normalize to 0-100 scale (assuming 42.2km is 100)
  const enduranceScore = Math.min(100, (longestRun / 42.2) * 100);

  // Calculate weekly volume
  const weeklyVolume = activities.reduce((sum, a) => sum + a.distance, 0) / 1000;
  // Normalize to 0-100 scale (assuming 100km/week is 100)
  const staminaScore = Math.min(100, (weeklyVolume / 100) * 100);

  // Calculate recovery based on frequency of runs
  const recoveryScore = Math.min(100, (activities.length / 7) * 100);

  // Calculate strength based on elevation gain
  const totalElevation = activities.reduce((sum, a) => sum + (a.total_elevation_gain || 0), 0);
  // Normalize to 0-100 scale (assuming 2000m elevation is 100)
  const strengthScore = Math.min(100, (totalElevation / 2000) * 100);

  // Calculate technique based on pace consistency
  const paces = activities.map((a) => 1000 / a.average_speed / 60);
  const avgPace = paces.reduce((sum, pace) => sum + pace, 0) / paces.length;
  const paceVariance = paces.reduce((sum, pace) => sum + Math.abs(pace - avgPace), 0) / paces.length;
  // Normalize to 0-100 scale (lower variance is better)
  const techniqueScore = Math.min(100, Math.max(0, 100 - paceVariance * 20));

  return {
    speed: Math.round(speedScore),
    endurance: Math.round(enduranceScore),
    stamina: Math.round(staminaScore),
    recovery: Math.round(recoveryScore),
    strength: Math.round(strengthScore),
    technique: Math.round(techniqueScore),
  };
}

export default function RunnerStats({ activities, className }: RunnerStatsProps) {
  const stats = calculateStats(activities);

  const data = [
    { subject: "Speed", A: stats.speed },
    { subject: "Endurance", A: stats.endurance },
    { subject: "Stamina", A: stats.stamina },
    { subject: "Recovery", A: stats.recovery },
    { subject: "Strength", A: stats.strength },
    { subject: "Technique", A: stats.technique },
  ];

  const CustomDot = ({ cx = 0, cy = 0, value = 0 }: CustomDotProps) => {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="#3b82f6" stroke="#fff" strokeWidth={2} className="filter drop-shadow-md" />
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#1f2937" className="text-xs font-medium">
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className={`${className || ""}`}>
      <div className="p-4">
        <div className="relative w-full h-full">
          <RadarChart width={300} height={300} data={data} className="mx-auto text-xs">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#1f2937", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#1f2937" }} />
            <Radar
              name="Stats"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              dot={(props: CustomDotProps) => {
                const { key, ...restProps } = props as { key?: string } & CustomDotProps;
                return <CustomDot key={key} {...restProps} />;
              }}
            />
          </RadarChart>
        </div>
      </div>
    </div>
  );
}
