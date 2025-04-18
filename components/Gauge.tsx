"use client";

import { useEffect, useState } from "react";

interface GaugeProps {
  currentTime: number; // in minutes, e.g. 270 for 4.5 hours
  goalTime: number; // in minutes
}

export default function Gauge({ currentTime, goalTime }: GaugeProps) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const percentage = Math.min(currentTime / goalTime, 1);
    setAngle(percentage * 180); // Half-circle gauge
  }, [currentTime, goalTime]);

  return (
    <div className="w-48 h-24 relative">
      <svg width="100%" height="100%" viewBox="0 0 200 100">
        <path d="M10,100 A90,90 0 0,1 190,100" fill="none" stroke="#e5e7eb" strokeWidth="20" />
        <path
          d="M10,100 A90,90 0 0,1 190,100"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray="282.74"
          strokeDashoffset={282.74 - (angle / 180) * 282.74}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center font-semibold">
        Predicted: {(currentTime / 60).toFixed(2)}h
      </div>
    </div>
  );
}
