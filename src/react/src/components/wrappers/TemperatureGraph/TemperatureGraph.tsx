import { TemperatureGraphDataPoint } from "@/models/Graph";
import {
  CartesianGrid,
  Label,
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
        >
          <Label value={"Time"} />
        </XAxis>
        <Legend verticalAlign="top" height={36} />
        <Tooltip />
        <YAxis unit={"%"} />
        {currentTimestamp && (
          <ReferenceLine
            ifOverflow="visible"
            x={currentTimestamp}
            stroke="red"
          />
        )}
        <ReferenceLine
          stroke="black"
          y={0}
          ifOverflow="visible"
          strokeWidth={2}
        />

        <CartesianGrid stroke="#f5f5f5" />
        {data[0] &&
          Object.keys(data[0]).map((key, index) => {
            if (key === "time") return null;
            return (
              <Line
                type="stepAfter"
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
