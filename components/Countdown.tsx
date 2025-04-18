"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  marathonDate: string; // e.g. "2025-09-14"
}

function getTimeLeft(dateStr: string) {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return "Race day!";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m`;
}

export default function Countdown({ marathonDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(marathonDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(marathonDate));
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [marathonDate]);

  return <div className="text-2xl font-semibold tracking-tight">⏳ Marathon Countdown: {timeLeft}</div>;
}
