import { TemperatureGraphDataPoint } from "@/models/Graph";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ITemperatureGraph {
  data: TemperatureGraphDataPoint[];
  deltaT?: number;
  currentTimestamp?: number;
}

const STROKES = [
  "#8ED081",
  "#B4D2BA",
  "#DCE2AA",
  "#B57F50",
  "#4B543B",
] as const;

const TemperatureGraph = ({ data, currentTimestamp }: ITemperatureGraph) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis
          dataKey={"time"}
          unit={"s"}
          interval={"equidistantPreserveStart"}
        />
        <Legend verticalAlign="top" height={36} />
        <Tooltip />
        <YAxis />
        {currentTimestamp && (
          <ReferenceLine
            ifOverflow="visible"
            x={currentTimestamp}
            stroke="red"
          />
        )}

        <CartesianGrid stroke="#f5f5f5" />
        {Object.keys(data[0]).map((key, index) => {
          if (key === "time") return null;
          return (
            <Line
              type="monotone"
              dataKey={key}
              stroke={STROKES[index]}
              isAnimationActive={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TemperatureGraph;
