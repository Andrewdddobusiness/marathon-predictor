"use client";

import { useEffect, useState } from "react";

interface ConfidenceBarProps {
  confidence: number; // 0 - 100
}

export default function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth(confidence);
    }, 100);

    return () => clearTimeout(timeout);
  }, [confidence]);

  return (
    <div className="w-full max-w-md h-6 bg-gray-200 rounded-full overflow-hidden shadow-md">
      <div
        className={`h-full transition-all duration-700 rounded-full ${
          confidence > 75 ? "bg-green-500" : confidence > 50 ? "bg-yellow-500" : "bg-red-500"
        }`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
