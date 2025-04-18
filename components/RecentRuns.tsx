"use client";

import { StravaActivity } from "@/lib/strava";

interface RecentRunsProps {
  runs: StravaActivity[];
  isLoading?: boolean;
}

export default function RecentRuns({ runs, isLoading }: RecentRunsProps) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-xl backdrop-blur-lg bg-white/40 border border-white/50 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">📊 Activity Log</h2>
        <div className="text-center py-8 text-gray-600">Loading your runs...</div>
      </div>
    );
  }

  if (!runs?.length) {
    return (
      <div className="p-6 rounded-xl backdrop-blur-lg bg-white/40 border border-white/50 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">📊 Activity Log</h2>
        <div className="text-center py-8 text-gray-600">No recent runs found</div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl backdrop-blur-lg bg-white/40 border border-white/50 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">📊 Activity Log</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                Distance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                Avg Pace
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                Elevation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {runs.map((run, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{run.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    {run.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(run.distance / 1000).toFixed(1)} km
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.floor(run.moving_time / 3600)}h {Math.floor((run.moving_time % 3600) / 60)}m
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(1000 / run.average_speed / 60).toFixed(2)} min/km
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {run.total_elevation_gain ? `${run.total_elevation_gain}m` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
