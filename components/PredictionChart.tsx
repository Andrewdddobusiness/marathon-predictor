"use client";

interface Props {
  averagePace: string;
  longestRun: number;
  confidenceLevel: "low" | "medium" | "high";
}

export function PredictionChart({ averagePace, longestRun, confidenceLevel }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 text-gray-800 text-lg font-medium">
      <div>
        <p className="text-sm text-gray-500">Average Pace</p>
        <p>{averagePace}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Longest Run</p>
        <p>{longestRun} km</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Confidence Level</p>
        <p className="capitalize">{confidenceLevel}</p>
      </div>
    </div>
  );
}
