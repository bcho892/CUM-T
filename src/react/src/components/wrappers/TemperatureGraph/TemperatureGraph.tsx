import { TemperatureMessage } from "@/models/Message";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ITemperatureGraph {
  data: (Omit<TemperatureMessage, "prefix"> & { time: number })[];
}

const STROKES = [
  "#8ED081",
  "#B4D2BA",
  "#DCE2AA",
  "#B57F50",
  "#4B543B",
] as const;

const TemperatureGraph = ({ data }: ITemperatureGraph) => {
  return (
    <LineChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <XAxis dataKey={"time"} />
      <Legend verticalAlign="top" height={36} />
      <Tooltip />
      <YAxis />

      <CartesianGrid stroke="#f5f5f5" />
      {Object.keys(data[0]).map((key, index) => {
        if (key === "time") return null;
        return <Line type="monotone" dataKey={key} stroke={STROKES[index]} />;
      })}
    </LineChart>
  );
};

export default TemperatureGraph;
