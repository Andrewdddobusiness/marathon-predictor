"use client";

import { useEffect, useState } from "react";

interface Race {
  name: string;
  date: string;
}

const RACES: Race[] = [
  { name: "HOKA Marathon", date: "2025-05-04" },
  { name: "City2Surf", date: "2025-08-10" },
  { name: "Sydney Marathon", date: "2025-08-31" },
  { name: "Melbourne Marathon", date: "2025-10-12" },
];

function getTimeLeft(dateStr: string): { months: number; days: number } {
  const target = new Date(dateStr);
  const now = new Date();

  // Set hours to 0 to just compare dates
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (totalDays <= 0) return { months: 0, days: 0 };

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  return { months, days };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Countdown() {
  const [raceTimes, setRaceTimes] = useState<
    { name: string; date: string; timeLeft: { months: number; days: number } }[]
  >(
    RACES.map((race) => ({
      name: race.name,
      date: race.date,
      timeLeft: getTimeLeft(race.date),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRaceTimes(
        RACES.map((race) => ({
          name: race.name,
          date: race.date,
          timeLeft: getTimeLeft(race.date),
        }))
      );
    }, 3600000); // update every hour (since we're only showing days now)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden rounded-lg">
      <table className="min-w-full">
        <thead>
          <tr className="bg-white/40 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Race</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Time Left
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {raceTimes.map((race) => (
            <tr key={race.name} className="bg-white/30 backdrop-blur-sm transition-all hover:bg-white/40">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{race.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(race.date)}</td>
              <td className="px-4 py-3 text-right">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  {race.timeLeft.months > 0 && <span>{race.timeLeft.months}m</span>}
                  {race.timeLeft.days > 0 && <span>{race.timeLeft.days}d</span>}
                  {race.timeLeft.months === 0 && race.timeLeft.days === 0 && (
                    <span className="text-green-600">Race day! 🎉</span>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
