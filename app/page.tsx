"use client";

import { predictMarathonTime } from "./actions/predict";
import { useState, useEffect } from "react";
import ConfidenceBar from "@/components/ConfidenceBar";
import Countdown from "@/components/Countdown";
import Gauge from "@/components/Gauge";
import { PredictionChart } from "@/components/PredictionChart";
import RecentRuns from "@/components/RecentRuns";
import RunnerAvatar from "@/components/RunnerAvatar";
import { StravaActivity } from "@/lib/strava";
import { getWeeklyRuns } from "@/lib/strava";
import StatsOverlay from "@/components/StatsOverlay";

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

  // Calculate level based on training volume (example calculation)
  const level = Math.floor((prediction?.trainingVolume || 0) / 5) + 1;
  const xpProgress = (((prediction?.trainingVolume || 0) % 5) / 5) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-white to-blue-50 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto relative">
        {/* Background gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">🏃‍♂️ Marathon Journey</h1>
              <p className="text-gray-600 mt-2">Track your progress, level up your running</p>
            </div>
            <button
              onClick={handleGeneratePrediction}
              disabled={isLoading}
              className="px-6 py-3 bg-white/40 backdrop-blur-lg text-gray-900 hover:bg-white/60 disabled:bg-white/30 rounded-xl shadow-lg transition-all border border-white/50"
            >
              {isLoading ? "Analyzing..." : "Generate Prediction"}
            </button>
          </div>

          {/* 3D Runner Avatar */}
          <div className="grid grid-cols-3 mt-8 p-6 mb-8">
            <div>
              <StatsOverlay activities={runs} />
            </div>
            <div className="col-span-2">
              <RunnerAvatar activities={runs} />
            </div>
          </div>

          {prediction ? (
            <>
              {/* Level and XP Bar */}
              <div className="p-6 rounded-xl backdrop-blur-lg bg-white/40 border border-white/50 shadow-lg mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-500 text-white rounded-lg px-3 py-1 font-bold">Lv.{level}</div>
                  <div className="flex-1 bg-white/40 rounded-full h-4">
                    <div
                      className="bg-blue-500 rounded-full h-4 transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-700">{xpProgress.toFixed(1)}%</div>
                </div>
                <p className="text-sm text-gray-600">Keep running to level up!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats Cards */}
                <div className="space-y-6">
                  <div className="p-6 rounded-xl backdrop-blur-lg bg-white/40 border border-white/50 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">⏱ Target Time</h2>
                    <p className="text-6xl font-bold text-blue-500 mb-4">{prediction.predictedTime}</p>
                    <ConfidenceBar confidence={prediction.confidence} />
                  </div>

                  <div className="p-6 rounded-xl backdrop-blur-lg bg-white/40 border border-white/50 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">📆 Upcoming Races</h2>
                    <Countdown />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-xl backdrop-blur-lg bg-white/40 border border-white/50 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">🔍 Performance Stats</h2>
                    <PredictionChart
                      averagePace={prediction.averagePace}
                      longestRun={prediction.longestRun}
                      confidenceLevel={prediction.confidenceLevel}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 rounded-xl backdrop-blur-lg bg-white/40 border border-white/50 shadow-lg text-center">
              <h2 className="text-2xl font-medium text-gray-900">Generate a prediction to start your journey!</h2>
            </div>
          )}

          {/* Recent Runs Section */}
          <div className="mt-8">
            <RecentRuns runs={runs} isLoading={isLoadingRuns} />
          </div>
        </div>
      </div>
    </main>
  );
}
