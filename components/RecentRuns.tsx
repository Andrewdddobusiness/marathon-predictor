"use client";

import { StravaActivity } from "@/lib/strava";

interface RecentRunsProps {
  runs: StravaActivity[];
  isLoading?: boolean;
}

export default function RecentRuns({ runs, isLoading }: RecentRunsProps) {
  if (isLoading) {
    return (
      <div className="mt-8 p-6 rounded-xl shadow bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📊 Recent Runs</h2>
        <div className="text-center py-8 text-gray-500">Loading your runs...</div>
      </div>
    );
  }

  if (!runs?.length) {
    return (
      <div className="mt-8 p-6 rounded-xl shadow bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📊 Recent Runs</h2>
        <div className="text-center py-8 text-gray-500">No recent runs found</div>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 rounded-xl shadow bg-white border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">📊 Recent Runs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distance (km)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Pace
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total EG
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {runs.map((run, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{run.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{run.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(run.distance / 1000).toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.floor(run.moving_time / 3600)}h {Math.floor((run.moving_time % 3600) / 60)}m
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(1000 / run.average_speed / 60).toFixed(2)} min/km
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{run.total_elevation_gain || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
