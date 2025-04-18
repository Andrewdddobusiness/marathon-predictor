import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  predictions: { date: string; time: number }[];
}

export function PredictionChart({ predictions }: Props) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current).attr("width", 500).attr("height", 300);

    const x = d3
      .scaleTime()
      .domain(d3.extent(predictions, (d) => new Date(d.date)) as [Date, Date])
      .range([0, 500]);

    const y = d3
      .scaleLinear()
      .domain([300, 180]) // from 5:00 → 3:00
      .range([300, 0]);

    const line = d3
      .line<{ date: string; time: number }>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.time));

    svg.selectAll("*").remove(); // clear before redraw
    svg
      .append("path")
      .datum(predictions)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 3)
      .attr("d", line);
  }, [predictions]);

  return <svg ref={ref}></svg>;
}
