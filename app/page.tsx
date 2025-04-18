"use client";

import { predictMarathonTime } from "./actions/predict";
import { useState, useEffect } from "react";
import ConfidenceBar from "@/components/ConfidenceBar";
import Countdown from "@/components/Countdown";
import Gauge from "@/components/Gauge";
import { PredictionChart } from "@/components/PredictionChart";
import RecentRuns from "@/components/RecentRuns";
import { StravaActivity } from "@/lib/strava";
import { getWeeklyRuns } from "@/lib/strava";

interface Prediction {
  predictedTime: string;
  confidence: number;
  confidenceLevel: "low" | "medium" | "high";
  daysUntilRace: number;
  trainingVolume: number;
  averagePace: string;
  longestRun: number;
}

export default function HomePage() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [runs, setRuns] = useState<StravaActivity[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);

  useEffect(() => {
    async function loadRuns() {
      try {
        const activities = await getWeeklyRuns();
        console.log(activities);
        setRuns(activities);
      } catch (error) {
        console.error("Failed to load runs:", error);
      } finally {
        setIsLoadingRuns(false);
      }
    }

    loadRuns();
  }, []);

  const handleGeneratePrediction = async () => {
    setIsLoading(true);
    try {
      const result = await predictMarathonTime();
      setPrediction(result);
    } catch (error) {
      console.error("Failed to generate prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4 md:px-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">🏃‍♂️ Marathon Predictor</h1>
        <button
          onClick={handleGeneratePrediction}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 rounded-lg shadow transition"
        >
          {isLoading ? "Generating..." : "Generate Prediction"}
        </button>
      </div>

      {prediction ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Predicted Time */}
            <div className="p-6 rounded-xl shadow bg-white border border-gray-200">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">⏱ Predicted Finish Time</h2>
              <p className="text-5xl font-bold mb-4 text-yellow-500">{prediction.predictedTime} hrs</p>
              <ConfidenceBar confidence={prediction.confidence} />
            </div>

            {/* Days Until Race */}
            <div className="p-6 rounded-xl shadow bg-white border border-gray-200">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">📆 Days Until Race</h2>
              <Countdown days={prediction.daysUntilRace} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Training Progress */}
            <div className="p-6 rounded-xl shadow bg-white border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Training Progress</h2>
              <Gauge value={prediction.trainingVolume} max={42.2} label="Training Volume (km)" />
            </div>

            {/* Performance Metrics */}
            <div className="p-6 rounded-xl shadow bg-white border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">🔍 Performance Metrics</h2>
              <div className="mt-4">
                <PredictionChart
                  averagePace={prediction.averagePace}
                  longestRun={prediction.longestRun}
                  confidenceLevel={prediction.confidenceLevel}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20 bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl text-gray-600 font-medium">Click the button above to generate your prediction</h2>
        </div>
      )}

      <RecentRuns runs={runs} isLoading={isLoadingRuns} />
    </main>
  );
}
